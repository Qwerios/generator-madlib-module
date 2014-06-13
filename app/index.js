( function()
{
    'use strict';
    var util    = require( 'util' );
    var path    = require( 'path' );
    var yeoman  = require( 'yeoman-generator' );

    // Determine packageName based on current folder name
    //
    var fullPath    = process.cwd();
    var packageName = fullPath.split( path.sep ).pop()

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

        this.pkg         = JSON.parse( this.readFileAsString( path.join( __dirname, '../package.json' ) ) );
        this.currentYear = new Date().getFullYear()
    };

    util.inherits( MadlibModuleGenerator, yeoman.generators.Base );

    MadlibModuleGenerator.prototype.askFor = function askFor( )
    {
        var callback = this.async();

        // Have Yeoman greet the user
        //
        console.log( this.yeoman );

        // Ask the user for the module details
        //
        var prompts = [
            {
                name:       'packageName'
            ,   message:    'What is the name of this module?'
            ,   default:    packageName
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
            ,   default:    this.user.git.username
            }
        ,   {
                name:       'authorEmail'
            ,   message:    'What is your email?'
            ,   default:    this.user.git.email
            }
        ];

        this.prompt( prompts, function( props )
        {
            this.packageName        = props.packageName;
            this.packageDescription = props.packageDescription;
            this.mainName           = props.mainName;
            this.authorName         = props.authorName;
            this.authorEmail        = props.authorEmail;

            callback();
        }.bind( this ) );
    };

    MadlibModuleGenerator.prototype.app = function app( )
    {
        this.mkdir( 'lib'  );
        this.mkdir( 'src'  );
        this.mkdir( 'test' );

        this.template( '_package.json', 'package.json' );
        this.template( 'README.md',     'README.md'    );
        this.template( 'LICENSE',       'LICENSE'      );

        this.copy( 'GruntFile.coffee',  'GruntFile.coffee'  );
        this.copy( 'module.coffee',     'src/' + this._.slugify( this.mainName ) + '.coffee' );
    };

    MadlibModuleGenerator.prototype.projectfiles = function projectfiles( )
    {
        this.copy( 'travis.yml',    '.travis.yml'   );
        this.copy( 'editorconfig',  '.editorconfig' );
        this.copy( 'jshintrc',      '.jshintrc'     );
        this.copy( 'gitignore',     '.gitignore'    );
    };
} )();