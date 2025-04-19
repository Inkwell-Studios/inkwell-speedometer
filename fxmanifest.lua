fx_version 'cerulean'
game 'gta5'

author 'Your Name'
description 'FiveM React NUI Template'
version '1.0.0'

-- UI
ui_page 'web/build/index.html'

-- Shared Scripts
shared_scripts {
    'shared/*.lua'
}

-- Client Scripts
client_scripts {
    'client/*.js',
    'client/*.lua'
}

-- Server Scripts
server_scripts {
    'server/*.js'
}

-- Additional UI Assets
files {
    'web/build/index.html',
    'web/build/**/*'
} 