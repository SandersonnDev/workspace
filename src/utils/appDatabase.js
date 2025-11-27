// Database of available applications
const appDatabase = {
    'vscode': {
        name: 'Visual Studio Code',
        icon: '📝',
        category: 'editor',
        executable: 'code'
    },
    'browser': {
        name: 'Navigateur',
        icon: '🌐',
        category: 'browser',
        executable: 'firefox'
    },
    'terminal': {
        name: 'Terminal',
        icon: '⌨️',
        category: 'system',
        executable: 'gnome-terminal'
    },
    'files': {
        name: 'Gestionnaire Fichiers',
        icon: '📁',
        category: 'system',
        executable: 'nautilus'
    },
    'gimp': {
        name: 'GIMP',
        icon: '🎨',
        category: 'graphics',
        executable: 'gimp'
    },
    'blender': {
        name: 'Blender',
        icon: '🔷',
        category: 'graphics',
        executable: 'blender'
    },
    'vLC': {
        name: 'VLC Media Player',
        icon: '📹',
        category: 'media',
        executable: 'vlc'
    },
    'discord': {
        name: 'Discord',
        icon: '💬',
        category: 'communication',
        executable: 'discord'
    },
    'spotify': {
        name: 'Spotify',
        icon: '🎧',
        category: 'media',
        executable: 'spotify'
    },
    'telegram': {
        name: 'Telegram',
        icon: '✈️',
        category: 'communication',
        executable: 'telegram-desktop'
    },
    'slack': {
        name: 'Slack',
        icon: '💼',
        category: 'communication',
        executable: 'slack'
    },
    'notion': {
        name: 'Notion',
        icon: '📋',
        category: 'productivity',
        executable: 'notion-app'
    }
};

export default appDatabase;
