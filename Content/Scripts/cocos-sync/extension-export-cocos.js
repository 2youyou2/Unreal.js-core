// @ts-nocheck
module.exports = () => {
    // console.warn('require : ' + require);
    let _ = require('lodash');
    // builder helper (for better js-ish code)
    function make(what) {
        if (what instanceof JavascriptUICommandInfo) {
            return function (builder) {
                console.warn('builder.AddToolBarButton 11: ' + what);
                builder.AddToolBarButton(what);
            };
        }
        else if (what instanceof Array) {
            let arr = what.map(make);
            return function (builder) {
                arr.forEach((fn) => fn(builder));
            };
        }
        else if (what.section) {
            let fn = make(what.inner);
            return function (builder) {
                builder.BeginSection(what.section);
                fn(builder);
                builder.EndSection();
            };
        }
        else if (what.pullDown) {
            let { tooltip, menu } = what;
            let fn = make(menu);
            return function (builder) {
                builder.AddPullDownMenu(what.pullDown, tooltip, fn);
            };
        }
    }
    const { defer, flush } = require('./utils/defer');
    function create_context(...args) {
        let context = JavascriptMenuLibrary.NewBindingContext(...args);
        defer((_) => context.Destroy());
        return context;
    }
    function create_commands(context, opts) {
        let commands = new JavascriptUICommands();
        let list = opts.Commands || [];
        commands.BindingContext = context;
        commands.Commands = list;
        function link(key) {
            return (what) => {
                let y = _.find(list, (x) => x.Id == what);
                return y && y[key] ? y[key]() : true;
            };
        }
        commands.OnExecuteAction = link('OnExecute');
        commands.OnIsActionChecked = link('OnIsActionChecked');
        commands.OnCanExecuteAction = link('OnCanExecuteAction');
        commands.Initialize();
        defer((_) => commands.Uninitialize());
        return commands;
    }
    function uicommandlist(commands) {
        let list = JavascriptMenuLibrary.CreateUICommandList();
        commands.Bind(list);
        return list;
    }
    function new_commands(opts) {
        let { context, contextDesc, parentContext, styleset } = opts;
        let source = JSON.stringify([
            context,
            contextDesc,
            parentContext,
            styleset,
            opts.commands,
        ]);
        let ctx = create_context(context, contextDesc || '', parentContext || '', styleset);
        let commands = create_commands(ctx, {
            Commands: _.map(opts.commands, (v, k) => ({
                Id: k,
                FriendlyName: v.friendlyName,
                Description: v.description,
                ActionType: v.actionType,
                OnExecute: v.onExecute,
                OnIsActionChecked: v.isChecked,
                OnCanExecuteAction: v.canExecute,
            })),
        });
        commands.list = uicommandlist(commands);
        commands.source = {
            commands: source,
        };
        return commands;
    }
    function new_extensions(commands, opts) {
        _.forEach(opts.extenders || [], (extension) => {
            let extender = new JavascriptExtender();
            let { target, type, hook, position, command } = extension;
            let extensibilityManager;
            if (type == 'toolbar') {
                let commandInfo = commands.CommandInfos[_.keys(opts.commands).indexOf(command)];
                extender.AddToolBarExtension(hook || 'Content', position || 'After', commands.list, make(commandInfo));
                extensibilityManager = JavascriptEditorLibrary.GetToolBarExtensibilityManager(target || 'LevelEditor');
            }
            else {
                console.error('Unsupported type', type);
                return;
            }
            extensibilityManager.AddExtender(extender);
            defer((_) => extensibilityManager.RemoveExtender(extender));
        });
    }
    function new_styleset(opts) {
        let { styleset, root, brushes } = opts;
        let style = JavascriptUMGLibrary.CreateSlateStyle(styleset);
        style.SetContentRoot(root || Root.GetDir('GameContent'));
        _.each(brushes, (v, k) => {
            let { path, size, tint } = v;
            style.AddImageBrush(k, style.RootToContentDir(path), size || { X: 40, Y: 40 }, tint || { R: 1, G: 1, B: 1, A: 1 }, 'NoTile', 'FullColor');
        });
        style.Register();
        defer((_) => style.Unregister());
        return style;
    }
    globalThis.ExportWorldToCocos = function () {
        require('./cocos-sync').cocosSyncWorld();
    };
    globalThis.ExportSelectedActorsToCocos = function () {
        require('./cocos-sync').cocosSyncSelectedActors();
    };
    globalThis.ExportSelectedAssetsToCocos = function () {
        require('./cocos-sync').cocosSyncSelectedAssets();
    };
    function exportToCocosToolbar() {
        // console.warn('load exportToCocosToolbar')
        new_styleset({
            styleset: 'ExportToCocos',
            root: Root.GetDir('EnginePlugins'),
            brushes: {
            // 'Cocos.ExportToCocos': {
            //     path: 'Marketplace/ExportToCocos/Resources/Icon128.png',
            // },
            },
        });
        let opts = {
            context: 'ExportWorldToCocos',
            contextDesc: 'Demo of unreal js extension',
            styleset: 'ExportToCocos',
            commands: {
                ExportWorldToCocos: {
                    friendlyName: 'ExportWorldToCocos',
                    description: 'ExportWorldToCocos',
                    actionType: 'Button',
                    onExecute: function () {
                        process.nextTick(function () {
                            globalThis.ExportWorldToCocos();
                        });
                    },
                },
                ExportSelectedActorsToCocos: {
                    friendlyName: 'ExportSelectedActorsToCocos',
                    description: 'ExportSelectedActorsToCocos',
                    actionType: 'Button',
                    onExecute: function () {
                        process.nextTick(function () {
                            globalThis.ExportSelectedActorsToCocos();
                        });
                    }
                },
                ExportSelectedAssetsToCocos: {
                    friendlyName: 'ExportSelectedAssetsToCocos',
                    description: 'ExportSelectedAssetsToCocos',
                    actionType: 'Button',
                    onExecute: function () {
                        process.nextTick(function () {
                            globalThis.ExportSelectedAssetsToCocos();
                        });
                    }
                },
            },
            extenders: [
                {
                    type: 'toolbar',
                    hook: 'Content',
                    command: 'ExportWorldToCocos',
                },
                {
                    type: 'toolbar',
                    hook: 'Content',
                    command: 'ExportSelectedActorsToCocos',
                },
                {
                    type: 'toolbar',
                    hook: 'Content',
                    command: 'ExportSelectedAssetsToCocos',
                },
            ],
        };
        global['$exportToCocosToolbar'] = opts;
        let commands = new_commands(opts);
        // new_extensions(commands, opts);
        let extender = new JavascriptExtender();
        let extensibilityManager;
        let menuWidget = JavascriptMenuLibrary.CreateComboButtonWidget(commands.list, commands);
        global['$cocosSyncMenuWidget'] = menuWidget;
        extender.AddToolBarExtension('Content', 'After', commands.list, function (builder) {
            builder.BeginSection('CocosSyncSection');
            let combo = new JavascriptComboButtonContext();
            combo.OnGetWidget = function (EditingObject) {
                // console.warn('menuWidget : ' + menuWidget)
                return menuWidget;
            };
            combo.OnGetLabel = function () {
                return 'CocosSync';
            };
            combo.OnGetTooltip = function () {
                return 'CocosSync';
            };
            global['$cocosSyncComboButtonContext'] = combo;
            builder.AddComboButton(combo, combo);
            builder.EndSection();
        });
        extensibilityManager = JavascriptEditorLibrary.GetToolBarExtensibilityManager('LevelEditor');
        extensibilityManager.AddExtender(extender);
        defer((_) => extensibilityManager.RemoveExtender(extender));
    }
    exportToCocosToolbar();
    return flush;
};
