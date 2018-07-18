let fs = require('fs')
let list = [
    {
        name:'model',
        type:'file',
    },
    {
        name:'schema',
        type:'file',
    },
    {
        name:'routers',
        type:'file',
    },
    {
        name:'public',
        type:'file',
        childfile:[
            {
                name:'images',
                type:'file',
            },
            {
                name:'css',
                type:'file',
            },
            {
                name:'js',
                type:'file',
            }
        ]
    },
    {
        name:'views',
        type:'file',
        childfile:[
            {
                name:'main',
                type:'file',
                childfile:[
                    {
                        name:'login',
                        type:'html',
                    },
                    {
                        name:'layout',
                        type:'html',
                    }
                ]
            }
        ]
    },
    {
        name:'db',
        type:'file',
    },
    
];

function createfiles(filedata,path,fs) {
    filedata.forEach(function (value) {
        if (value.type === 'file'){
            let wholepath = path+'/'+value.name;
            fs.mkdirSync(wholepath);
            if (value.childfile){
                createfiles(value.childfile,wholepath,fs)
            }
        }else {
            let wholepath = path+'/'+value.name+'.'+value.type;
            fs.writeFileSync(wholepath)
        }
    })
}
createfiles(list,__dirname,fs)
