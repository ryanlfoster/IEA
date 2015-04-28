IEA quick start guide
============    

[TOC]

Getting started with IEA
======

To get started with the code here you'll need a few things:

- [Node.js](http://nodejs.org/)/[npm](https://npmjs.org/) 
- [Grunt](http://gruntjs.com/) (`npm install -g grunt-cli`)
- [Bower](http://bower.io/) (`npm install -g bower`)
- [Yeoman/generator-generator](http://yeoman.io/generators.html) (`npm install -g yo generator-generator`)


If you need help installing some of these tools on a PC, please see [this short YouTube video](http://www.youtube.com/watch?v=kXikXodx-y4).

**NOTE : Read [know Issues](#known-issues) in case you are finding porblem doing setup**

When you've got all that set up, `cd` into the directory where you wish to create your project.Get the code downloaded from the [IEA Vox page](https://vox.sapient.com/docs/DOC-124182)

*If you have already checkedout the code base. do update the code to get the latest code.*

Now that you have the repository you'll need to `cd` into the working directory and download the project dependencies:

```shell
$ cd <<project folder>>
$ npm install
$ bower install
```

**NOTE: Depending on your system settings you may need to use `sudo` in front of any commands that don't execute correctly.**

You're now ready to work on the project. Run the Grunt command to open up a local server and get all the benefits of using Grunt.

```shell
$ grunt server
```

Done!

**NOTE: If you run into an `EMFILE, too many open files` error in Terminal, see [this](https://github.com/yeoman/yeoman/wiki/Additional-FAQ#q-im-getting-emfile-too-many-open-files).**

---

Generator Setup
======

To use the generator properly through the command line you have to link it in npm.  To do so, run the following:

```
$ cd <<Project folder>>/generator-iea
$ npm install
$ npm link
```

This creates a link on your system to the generator-iea directory which will allow you to easily call the generator from the command line.

Using IEA with commandline 
=======

Once you have linked the generator-iea. you should be able to use commands in console for creating application, views, collection, model, module and service.

## Application generator

Application generators provides a functional boilerplate app out of the box.

```
$ cd <<project folder>>
$ yo iea helloWorld
$ npm install
$ bower install
```

## Available sub-generators

- iea:component
- iea:collection
- iea:model
- iea:module
- iea:service

**Example**

```
$ cd <<project folder>>
$ yo iea:component helloWorld
```



##Application configuration
IEA application is located inside the config folder. when creating an IEA application , we can optionally send a configuration which can add/override the default setting of IEA application.

|Method Name|Type|Description|
|----------|-----|--------|
|name|`string`|name of the app|
|theme|`string`|theme for the app|
|lib|`path`|path for the IEA lib folder|
|app|`string`|name of the application folder|
|dist|`string`|name of the dist folder|
|appBasePath|`path`|path for the app folder|
|debug|`boolean`|to enable disable the debug informations|
|dependencies|`array`|dependencies which should be loaded after the application starts, this uses require to load the dependencies|
|defaultTemplateName|`array`|Possible names for the component templates|
|templatePath|`path`|relative path where the template folder is located|
|imagePath|`path`|relative path where the images are located|
|sassPath|`path`|relative path where the sass files are located|
|jsPath|`path`|relative path where the component js files are located|
|cssPath|`path`|reltive path where css files and font icons are located|
|breakpoints|`object`| json object which describes the breakpoints which is used for adaptive image|
|template|`object`|application template and engine settings|
|i18n|`object`|internationalization settings|
|layout|`object`|layout settings|
|conventions|`object`|application folder and file nameing convensions|
|settings|`object`|other application settings|
|environment|`object`|environment detection and settings|
|development|`object`|development settings|
|stage|`object`|stageserver settings|
|production|`object`|production settings|

## Application Events
IEA uses a mix of backbone event and triggerMethod functionality to Trigger an event and a corresponding method on the target object *(application, view, module, service)*. When an event is triggered, the first letter of each section of the event name is capitalized, and the word "on" is tagged on to the front of it. 

**Examples:**

`triggerMethod("render")` fires the "onRender" function
`triggerMethod("before:destroy")` fires the "onBeforeDestroy" function

All arguments that are passed to the triggerMethod call are passed along to both the event and the method, with the exception of the event name not being passed to the corresponding method.

**Usage**
`triggerMethod("foo", bar)` will call `onFoo: function(bar){...})`


**NOTE : Trigger event princple works same for application, module, component and service the same way. this is also the core building block of extensible components in IEA**

##Application Methods
IEA Application exposed some methods which can be used anywhere in the application by using the `app.` scope

|Method Name|Description|
|----------|--------|
|addInitializer|enables application to add initialize level logics which gets executed when the application is started|
|start|Starts the application|
|getValue|can use to get the configuration value from the application|
|setValue|Use to set or update application configuration|
|getTemplate|use getTempate to get the component template |
|getCurrentBreakpoint|get the current application breakpoint|
|onConfigLoad|gets fired when the application configuration is loaded|
|onApplicationReady|get fired when the appication is ready to start|
|onBeforeStart|get fired just before starting the application. |
|onStart|gets fired when the application is started|
|onMatchMobile|gets fired when the application hits mobile breakpoints|
|onUnmatchMobile|gets fired when the application moved out of mobile|
|onMatchTablet|gets fired when application hits Tablet breakpoint|
|onUnmatchTablet|gets fired when application moved out of tablet|
|onMatchdesktop|gets fired when application hits desktop breakpoint|
|onUnmatchDesktop|gets fired when the application moved out of desktop|
|onWindowResized|gets fired when the application browser window is resized|
|onImageLazyloaded|get fired when adaptive image is loaded|
|onWindowScrolled|gets fired when window is scrolled|
|triggerMethod|can use this method to trigger an event in the application context|
|triggerMethodOn|can use this method to trigger event on specified context|
|_super|use this method inside the component methods which will make sure the super method is called|

**Example**
```js
    onMatchMobile: function () {
        // gets fired when the application hits mobile breakpoints
    }
```

Component List
======

After running grunt server you will have be able to see all the out-of-box components listed in the [index.html](http://localhost:9000/).


### Create your component using the generator (recommended)

Using the iea generator to create the component by using the below syntax

`yo iea:component [name]`

**Example: **

`yo iea:component helloWorld`

After sucessfull execution of generator you should get files created is required locations as below

- */app/data/helloWorld.json*
- */app/js/template/helloWorld/defaultView.hbss*
- */app/js/views/helloWorld/helloWorld.js*
- */app/sass/views/helloWorld/_helloWorld.scss*

---

Once these files are created you have to make some hard binding of the sass file to the *_base.scss* file at the end where all component scss is imported.

The name of the template is set as defaultView and the same can be controlled by modifying the **config.js** file in the */config/config.js*. 

**Config.js**
```js
    'defaultTemplateName' : ['defaultView','landingView']
```
the `defaultTemplateName` property can accept both string and array of possible view names which you are going to use. if you set this propertly as empty string `''`. The Framework will consider the component hbss name to be same as the component name.

##Component defenition
All component in IEA is an instance of IEA.module and below are many ways you can define 

**Non AMD defenition**
```js
IEA.module('UI.custom-list', function(custom-list, app, IEA) {    

    this.intitialize = function(){
        this._super();
    };
    
});
```

**Non AMD defenition with object extension**
```js
IEA.module('UI.custom-list', function(custom-list, app, IEA) {    

    _.extend(this,{ // this is equal to custom-list which is passed as the first paramater
        intitialize: function(){
            this._super();
        };
    })
    
});
```

**AMD defenition with object extension**
```js
define(function(){
    var CustomList = IEA.module('UI.custom-list', function(custom-list, app, IEA) {    

        _.extend(this,{ // this is equal to custom-list which is passed as the first paramater
            intitialize: function(){
                this._super();
            };
        })
        
    });   
    
    return  CustomList;
});

```

##Component events
All component in iea exposes some default set of events as below

- `before:show`
- `show`

Inside the component you can add any no-of trigger events using (`this.triggerMethod('event-name',[parmaters])`)

##Component Methods
Every component in IEA exposes a set of methods which you can use to get add more power to the component.

|Method Name|Description|
|-----------|-----------|
|initialize| gets called automatically when the component view is intialized|
|render| component view render function which gets called when the component is intialized|
|addEvents|enables you to add more events into the component behaviour logic|
|removeEvents|remove existing events |
|updateSetting|enables you to update or add component defaultsettings|
|getTemplate|get the componen template by passing the componen name to it |
|getModelJSON|use to fetch the component JSON based on the modulename |
|clearStyles|create element style attr , need to pass the element instance|
|stop||
|hide||
|clean||
|onBeforeShow|fires just before the component is shown|
|onShow|fires when the component is shown|
|onMatchMobile|gets fired when the application hits mobile breakpoints|
|onUnmatchMobile|gets fired when the application moved out of mobile|
|onMatchTablet|gets fired when application hits Tablet breakpoint|
|onUnmatchTablet|gets fired when application moved out of tablet|
|onMatchdesktop|gets fired when application hits desktop breakpoint|
|onUnmatchDesktop|gets fired when the application moved out of desktop|
|onWindowResized|gets fired when the application browser window is resized|
|onWindowScrolled||
|triggerMethod|can use this method to trigger an event in the application context|
|triggerMethodOn|can use this method to trigger event on specified context|
|_super|use this method inside the component methods which will make sure the super method is called|


##Extending components
IEA enables all the OOB components to be *Extended/Overrided* to custom requirements. There are three stages where you can extend a components

- Extending template
- Extending JS
- Extending Css

##How extensiblity works !

Each component created in the IEA with the same name (*Name is the key*) automatically binds with the IEA OOB component. The application first looks for template in the  `App` folder, if not found it will look into `Lib` folder. you can extend any of the three points avoiding other two. For example. you can just extend or override the template of the component and still ignore others.

**NOTE: In many cases making a markup change could impact the underlying behaviour as well and hence would need change to Js and sometime to css as well**

##Template Overriding
There is only overriding possible with template as the moment you specify the same name template in your *app/js/template* folder, the application will pick the `app` version and not the `lib` version. However, you can add more markup or change the existing markup based on your requirement.

**Example**

IEA version of the list component markup

```html
<ul>
    {{#each list.linkList}}
        <li>
            {{#if linkName}}
                {{#if linkUrl}}
                    <a target= "{{#ifCond windowType "Yes"}}_blank{{else}}_self{{/ifCond}}" href="{{linkUrl}}">{{{linkName}}}</a>
                {{else}}
                    <a disabled>{{linkName}}</a>
                {{/if}}
            {{/if}}
        </li>
    {{/each}}
</ul>
```

Application overiding the same with more markups

```html
<ul class="list list-stacked">
    <li>1</li>
    <li>2</li>
    <li>3</li>
    <li>4</li>
    <li>5</li>
</ul>
```
By default all components look for the defaultview (hbss) file inside the component folder in templates. if you want to use custom templates. you can use `this.getTemplate(componentname[,templatepath])` method to fetch the required template. The method take two parameters, the first parameter is the component name which you can pass and the function will return the default tempate for that component. if you pass the second parameter as the explicity related path of the template (in case you want to use different template), the first parameter will be ignored and the funtion will return you the template which is asked for.

**Example for fetching template using method**

Default way of getting template is using this.template 

```js
this.$el.html(this.template(this.getModelJSON()));
```
**Custom template can be fetched as below**

```js
this.template = this.getTemplate('componentName');
this.$el.html(this.template(this.getModelJSON()));

OR

this.template = this.getTemplate('customname','relative/path/to/custom/template.hbss');
this.$el.html(this.template(this.getModelJSON()));
```

**NOTE: custom name can be any name just to identify the template, in case you are using the second parameter**

##Styling the component.
Application can override the existing styling of the components using the same principle for themeing any website. The application structure will have *app/sass/views/component/_component_scss* where you can add or override the styling of the existing component.

All app level component css will have the parent css as the component name 

**Example**

App scss (*app/sass/views/carousel/_carousel.scss*) file content of carousel will look as below

```css
.carousel {
    
}

```
You can add any no of css overriding into the scss file to change the styling of the component. The final build will make sure that the override css is added to the build file.


##Extending and over-riding behaviour
IEA components support both composition and inheritance methodology. Any two components with the same name acts as one by creating a automatic composition of all the methods and properties into one final component. For inheritance, any component in IEA can extend another component. 

**Composition benefits**
Composition enables component to have many version where the last added version will override/add/update the previous version. This principle enables project to have many version of the same component which keeps on changing behaviour.

Composition also enables writing modulatized component where the same component can be written in many parts and the framework will combile it together before initialization

**Inheritance benefits**

Inheritance in IEA component works on the same javascript prototype chaining principle where the child components protoype is updated with parent component and the chain can be of any length up to the topmost component which will always be IEA.View.

IEA supports any level of inheritance where a component can inherit another component which inturn can inherit another component.

*NOTE: IEA currently supports only single level inheritance*

```js
IEA.module('UI.custom-list', function(inheritanceSample, app, IEA) {

    this.extend = app.UI['list'];

    this.intitialize = function(){
        this._super();
    };
    
});
```

**Component hooks (Event Emitters)**
All components exposes two type of methods. One with `on` prefixed and other without it. the function with `on` are extension hooks where you can extent the logic, where are the latter ones are methods which are exposed for all components from its super class. 

Apart of the extended hooks and super class methods, you can use any no of custom methods according to the requirement.

**NOTE : Super class methods needs to be used inside component methods to execute it.**

**Example**

```js
define(function() { 
'use strict'; 
    var Video = IEA.module('UI.video', function(video, app, IEA) {                       
        _.extend(video,{ 
                onInit: function() {
                    this.addEvent({
                        'click img': '_highlightImage'
                    });
                },

                _highlightImage: function(){
                    console.log('highlight the image');
                }
        }); 
    }); 
return Video; 
}); 
```

###Common Methods

**onInit** : Extension of the iea component initialize function, this can be used to add more initialization logic to the component.

**onRender**: Extension of the iea render function which can be used to add post render functionalities

**onEnable**: Extension of IEA enable function which can be used to add post enable functionlities.

**addEvent** : Helps to add events to DOM and bind a callback to the event.

**removeEvent**: remove existing events from the event object.

**updateSettings**: All component has a defaultSetting which can be updated/overrided using the updateSettings method.

## Breakpoint modification
IEA Framework now enables easy way to update breakpoints which reflects both in js and css. The breakpoints can be configured in configuration js file.

**Sample structure of how breakpoint configuration is added**


```js
    'breakpoints': {
        'deviceSmall': '320px',
        'deviceMedium': '480px',
        'deviceLarge': '768px',
        'deviceXlarge': '1025px',
        'containerSmall': 'auto',
        'containerMedium': 'auto',
        'containerLarge': '750px',
        'containerXLarge': '960px'
    }

```

##Grid System
Grid systems are used for creating page layouts through a series of rows and columns that house your content. Here's how the Bootstrap grid system works:

- Rows must be placed within a `.container` (fixed-width) or `.container-fluid` (full-width) for proper alignment and padding.
- Use rows to create horizontal groups of columns.
- Content should be placed within columns, and only columns may be immediate children of rows.
- Predefined grid classes like `.row` and `.col-xs-4` are available for quickly making grid layouts. Less mixins can also be used for more semantic layouts.
- Columns create gutters (gaps between column content) via padding. That padding is offset in rows for the first and last column via negative margin on .rows.
- Grid columns are created by specifying the number of twelve available columns you wish to span. For example, three equal columns would use three `.col-xs-4`.
- Gutter width is 30px (15px on each side of the column).

**We use the following media queries in our Sass files to create the key breakpoints in our grid system.**

```css
/* Extra small devices (phones) */
/* No media query since this is the default in Bootstrap */

/* Small devices (480px and up) */
@media (min-width: $screen-sm-min) { ... }

/* Medium devices (768px and up) */
@media (min-width: $screen-md-min) { ... }

/* Large devices (1025px and up) */
@media (min-width: $screen-lg-min) { ... }
```

**We occasionally expand on these media queries to include a max-width to limit CSS to a narrower set of devices.**

```css
@media (max-width: $screen-sm-max) { ... }
@media (min-width: $screen-sm-min) and (max-width: $screen-sm-max) { ... }
@media (min-width: $screen-md-min) and (max-width: $screen-md-max) { ... }
@media (min-width: $screen-lg-min) { ... }
```

Read more about [grid system](http://bootstrapdocs.com/v3.1.1/docs/css/#grid)
