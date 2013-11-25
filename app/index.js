( function( )
{
    'use strict';
    var util   = require( 'util' );
    var path   = require( 'path' );
    var yeoman = require( 'yeoman-generator' );

    // Get the current running directory name
    //
    var fullPath   = process.cwd();
    var folderName = fullPath.split( '/' ).pop();

    var MadlibModuleGenerator = module.exports = function MadlibModuleGenerator( args, options, config )
    {
        yeoman.generators.Base.apply( this, arguments );

        this.on( 'end', function( )
        {
            this.installDependencies(
            {
                skipInstall: options[ 'skip-install' ]
            } );
        } );

        this.pkg = JSON.parse( this.readFileAsString( path.join( __dirname, '../package.json' ) ) );
    };

    util.inherits( MadlibModuleGenerator, yeoman.generators.Base );

    MadlibModuleGenerator.prototype.askFor = function askFor( )
    {
        var cb = this.async();

        // Have Yeoman greet the user
        //
        console.log( this.yeoman );

        // Ask the user for the module details
        //
        var prompts = [
            {
                name:       'packageName'
            ,   message:    'What is the name of this module?'
            ,   default:    folderName
            }
        ,   {
                name:       'packageDescription'
            ,   message:    'What is the purpose (description) of this module?'
            }
        ,   {
                name:       'mainName'
            ,   message:    'What is the main JavaScript file name of this module?'
            ,   default:    'index'
            }
        ,   {
                name:       'authorName'
            ,   message:    'What is your name?'
            }
        ,   {
                name:       'authorEmail'
            ,   message:    'What is your email?'
            }
        ];

        this.prompt( prompts, function( props )
        {
            this.packageName        = props.packageName;
            this.packageDescription = props.packageDescription;
            this.mainName           = props.mainName;
            this.authorName         = props.authorName;
            this.authorEmail        = props.authorEmail;

            cb();
        }.bind( this ) );
    };

    MadlibModuleGenerator.prototype.app = function app( )
    {
        this.mkdir( 'lib'  );
        this.mkdir( 'src'  );
        this.mkdir( 'test' );

        this.template( '_package.json', 'package.json' );
        this.template( 'README.md',     'README.md'    );

        this.copy( 'GruntFile.coffee',  'GruntFile.coffee'  );
        this.copy( 'LICENSE',           'LICENSE'           );
        this.copy( 'module.coffee',     'src/' + this._.slugify( this.mainName ) + '.coffee' );
    };

    MadlibModuleGenerator.prototype.projectfiles = function projectfiles( )
    {
        this.copy( 'editorconfig',  '.editorconfig' );
        this.copy( 'jshintrc',      '.jshintrc'     );
        this.copy( 'gitignore',     '.gitignore'    );
    };
} )();