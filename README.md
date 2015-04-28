IEA Developer guide
============    

[TOC]

Conceptual Overview
=======

| Concept               | Description    | 
| --------------------- | ----------------- | 
| `IEA.Application`    |   Create new iea application using IEA.Application which return a new instance of the app.
| `IEA.View` |             New view in iea is created by extending IEA.view. 
| `IEA.Model` |            Create new model by creating instance of IEA.Model
| `IEA.Collection`|        Create new collection by creating instance of IEA.Collection
| `IEA.Config`|            IEA stored all the application and tenant configuration inside the IEA.config class which is accessible throughout the application using `app.getValue()` 
| `IEA.callbacks`|         IEA.Callback can be used to register callbacks which can be executed in future 
| `IEA.TriggerMethod`|     IEA level observer pattern which can be used to trigger events and also methods which is prefixed with `on`. 
| `IEA.Module`|            IEA's Core class which is used to create components and general modules. Modules are singleton in nature. 
| `IEA.Service`|           IEA's Core class to create Service class which returns new instance or every call. 
| `IEA.Analytics`|         IEA analytics implementation

Getting started with IEA
======

To get started with the code here you'll need a few things:

- [Node.js](http://nodejs.org/)/[npm](https://npmjs.org/) 
- [Grunt](http://gruntjs.com/) (`npm install -g grunt-cli`)
- [Bower](http://bower.io/) (`npm install -g bower`)
- [Yeoman/generator-generator](http://yeoman.io/generators.html) (`npm install -g yo generator-generator`)
- [Compass](http://compass-style.org/) (`gem install compass`) 


If you need help installing some of these tools on a PC, please see [this short YouTube video](http://www.youtube.com/watch?v=kXikXodx-y4).

**NOTE : Read [know Issues](#troubleshooting) in case you are finding porblem doing setup**

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

Once you have linked the generator-iea, you should be able to use commands in console for creating application, views, collection, model, module and service.

## Application generator *

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

Component List
======

After running grunt server you will have be able to see all the out-of-box components listed in the [index.html](http://localhost:9000/).

Creating Application
=========
The IEA.Application object is the hub of your composite application. It organizes, initializes and coordinates the various pieces of your app.

The code base comes with the boilerplate application which you can run rightaway using grunt command. the boilerplate code consist of 

- `app.js`
- `main.js`

`app.js` if the js where the new application instance is created and returned. on loading of the application with its configuration and tentant configuration you will get the events exposed (`application:ready`) which you can listen to before firing the `app.start()` (explained below)

**Example**

```js
var app = new IEA.Application([configuration object]);
    app.start();
```

##Adding Intializer
All those logic which should be executed with the application start can be added into initializer callbacks which gets executed immediatly when the application starts running

**Example**
```js
    app.addInitializer(function() {
        //application logic which will get executed on app.start()
    });
```

##Application events
the application raises couple of events during its lifecycle which can be used by the application which can be used to add addition processing of your application 

- `config:loaded`
- `config:changed`
- `application:ready`
- `before:start`
- `start`

**Example**

```js
    app.on('start', function (options) {
        // gets triggered when the application start is fired.
    });
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
|getModelJSON|use to fetch the component JSON based on the modulename |
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

##Creating Components


Components in IEA is a combination of **json, hbss, js and scss** which has to created in its own designated folders.


- **JSON** : The json file which is created in the **/app/data/** folder will be used by the component to unit test it. the json should adher to the set contract structure for the component to work correctly

- **HBSS** : IEA uses handlebars to create templates. the file has extension *.hbss*. the template files are located in **/app/js/template/** folder. each component will have a folder with the component name and inside you will have the template file. By default the *hbss* files are named as *defaultView.hbss*. This can be overridden using the application configuration explan later in the docs.

- **JS** : Each component will have its own js file which is located in the  **/app/js/view** . the component js will be places inside the folder with the same name of component.

- **SASS** : Component sass file is located inside */app/sass/views/* folder. Each sass file is located inside the folder with the component name.

**NOTE : you should not change the name of the folder for a component or name of the json file after you have created the component. the folder name and file name is mapped with the component and execution failes if renamed incorrectly**

The following steps outline how components are created:

Main level components should always be housed in a folder/path that is of the same name as they are for organizational purposes.  You can take a look of the current state of the components directory to see an example of how to properly path them.

**Create component manually**

To create a component manually to have to add files describe above.

Each files has its own designation location. 

**Example: **

Create a helloWorld Component by adding files in the below locations

- */app/data/helloWorld.json*
- */app/js/template/helloWorld/defaultView.hbss*
- */app/js/views/helloWorld/helloWorld.js*
- */app/sass/views/helloWorld/_helloWorld.scss*


**Create your component using the generator (recommended)**

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

##Type of Components

IEA components can be used as both serverside and clientside rendering based on the data attributes provided.

All components has one mandatory data attribute `data-role` which tells the framework which component js it should bind the markup with.

**Usage**

```HTML
    <div data-role="navigation"></div>
```

###Client-side component
A client-side component does not have any content markup but only the container with `role` and `path` attributed provided. the `data-path` attribute suggests the component to hit the path and get the component specific configuration and data from a REST URL
    
**Example**
```HTML
<div data-role="navigation" data-path="/data/navigation.json"></div>
```

###Sever-side component
A server side component in iea is a component where the component markup is rendered from backend and only the behavior is binded with js **(No markup rendering happens)**

A SS Component uses `data-role` and `data-config` attributes to determine the component and its configuration (from inline script) and then binds with the front end component js

**Example**

```HTML
<script type="text/module-config" id="carousel-1-config"> 
    {
        "data": {
            "randomNumber": "1",
            "carousel": {
                "numlinks": "2",
                "slides": {
                    "length": 2
                },
                "intervalsOfRotation": "2",
                "randomNumber": "110"
            },
            "componentType": "carousel",
            "isContainer": false
        }
    }
</script>   

<div data-role="carousel" data-config="carousel-1-config"> 
    <div> 
        <div class="media"> 
            <img src=“path/to/image" alt=“alternate text comes here" title="slide 1"> 
        </div> 
    </div> 
</div> 

```
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

**onBeforeInit** : Extension of the iea component before initialize function, this can be used to before initialization of the component.

**onInit** : Extension of the iea component initialize function, this can be used to add more initialization logic to the component.

**onBeforeRender**: Extension of the iea before render function which can be used to add before render functionalities

**onRender**: Extension of the iea render function which can be used to add post render functionalities

**onEnable**: Extension of IEA enable function which can be used to add post enable functionlities.

**addEvent** : Helps to add events to DOM and bind a callback to the event.

**removeEvent**: remove existing events from the event object.

**updateSettings**: All component has a defaultSetting which can be updated/overrided using the updateSettings method.


###Adaptive-image
Only the default methods exists for extending.

###Breadcrumb

Default methods exists for extending.
**Other methods for extending**

**beforeLinkClick** : do something before the link is clicked to navigate to other page

###Carousel

**Options**
`updateSettings` take options as an object been passed to it. Carousel internally uses Slider service and you can see the options in the [option documentation](http://bxslider.com/options)

`defaultSettings`

|Options|Type|Value|
|-------|----|-----------|
|controls|Boolean| `default: true` |
|auto|Boolean| `default: false` |
|pager|Boolean| `default: false` |
|infiniteLoop|Boolean| `default: false` |
|autoControls|Boolean| `default: true` |
|adaptiveHeight|Boolean| `default: false` |
|video|Boolean| `default: false` |

###Content-results-grid

Default methods exists for extending.
**Other methods for extending**

**onFirstPage**: this method is used when you want to do some action on the first page show

**onNextPage**: Method to be used on each next page show

**Options**

|Options|Type|Value|
|-------|----|-----------|
|articleContainer|String|`default:'.article-container'`|
|sortingEl|String|`default:'.selected-sort-key'`|
|pageIndexEl|String|`default:'.page-index'`|
|pageSortKey|String|`default:'default'`|
|waypointOffset|String|`default:'bottom-in-view'`|
| mode|String|`default:'client'`|
| sortingField|String|`default:'titleDetail'`|
| articleInnerEl|String|`default:'div.thumbnail'`|

###Form

Default methods exists for extending.
**Other methods for extending**

**onBeforeEnable**: Extension to add logic before the component is enabled.

**onFormSubmit**: used when you want to tap into form submit.

**onFormReset**: used when you want to tap into form reset.

**onSuccess**: use this method to add logic when the form submission is success

**onError**: use this method to add logic when the form submission failed.

**Options**

|Options|Type|Value|Description|
|-------|----|-----------|
|calenderInput|String|`default:'.input-calendar'`| form calendar input class name|
|calenderTodayBtn|String|`default:'linked'`|
|calenderAutoclose|Boolean|`default:true`| autoclose calendar or not|
|calenderTodayHighlight|Boolean|`default:true`| highlight today|

###Hotspot

**Options**

|Options|Type|Value|
|-------|----|-----------|
|baseImage|String|`default: '.base-image'`|
|pointerContainer|String|`default: '.pointer'`|
|pointer|String|`default: '.hotspot-pointer'`|
|pointerContent|String|`default: '.hotspot-content'`|
|pointerEvent|String|`default: 'click'`|
|pointerPosition|String|`default: 'bottom'`|
|onlyOne|boolean||`default: true`||

###Instagram-feed
Only the default methods exists for extending.

###List
Only the default methods exists for extending.

###Media-gallery

Default methods exists for extending.
**Other methods for extending**

**onPopupEnable**: use this method to do something when the media-gallery popup option is enabled (only in desktop).

**onSlideEnable** use this method to do something when the Slider option is enabled (in mobile).

**Options**

|Options|Type|Value|
|-------|----|-----------|
|articleContainer|String|`default:'.article-container'`|
|sortingEl|String|`default:'.selected-sort-key'`|
|pageIndexEl|String|`default:'.page-index'`|
|pageSortKey|String|`default:'default'`|
|waypointOffset|String|`default:'bottom-in-view'`|
| mode|String|`default:'client'`|
| sortingField|String|`default:'titleDetail'`|
| articleInnerEl|String|`default:'div.thumbnail'`|

###Navigation

Default methods exists for extending.
**Other methods for extending**

**onBeforeInit** : do something before the navigation is intialized

**onMouseenter** : do somthing when the mouse enter the nav item

**onMouseleave** : do something when the mouse leave the nav item

**onMouseclick** : do somethine when you click on the nav item

**Options**

|Options|Type|Description|
|-------|----|-----------|
|enableHover|`default:true`| enable flyout on hover, other option `false`|

###Pinterest
Only the default methods exists for extending.

###Plain-text-image
Only function overriding exists for this component

###Related-content-list
Only the default methods exists for extending.

###Rich-text-image
Only function overriding exists for this component

###Search-input
Only the default methods exists for extending.

###Search-result

Default methods exists for extending.
**Other methods for extending**

**onFirstPage**: this method is used when you want to do some action on the first page show

**onNextPage**: Method to be used on each next page show

###Social-share-print
Only the default methods exists for extending.

###Panel
Only the default methods exists for extending.

###Twitter-feed
Only the default methods exists for extending.

###Video

Default methods exists for extending.
**Other methods for extending**

**onPlay**: do something when video plays

**onPause**: do something when video pause

**onStop**: do something when stops

**onDestroy**: do something when video element is destroyed

**onRestart**: do something when the video is restarted

**onSeek**: do something when the video seeked

**onResize**: do seomthing when the video is resized

###Section Navigation

Default methods exists for extending.
**Other methods for extending**

**onBeforeInit** : do something before the navigation is intialized

**onBeforeShowMenu** : do somthing before when the Menu is clicked to expand

**onAfterShowMenu** : do something after when the Menu is clicked to expand

**onBeforeHideMenu** : do something before when the Menu is clicked to collapse

**onAfterHideMenu** : do something when the Menu is clicked to collapse

###Country language Selector

Default methods exists for extending.
**Other methods for extending**

**onBeforeInit** : do something before the Country Language Selector is intialized

**onBeforeExpand** : do somthing before when the Menu is expanded on mobile screen

**onAfterExpand** : do something after when the Menu is expanded on mobile screen

**onBeforeOpen** : do something before dropdown is shown

**onAfterOpen** : do something after dropdown is shown

**onBeforeClose** : do something before dropdown hides

**onAfterClose** : do something after drodown hides


###Expand Collapse

Default methods exists for extending.
**Other methods for extending**

**onBeforeInit** : do something before the Expand Collapse is intialized

**onBeforeExpand** : do somthing before when the content is expanded

**onAfterExpand** : do something after when the content is expanded

**onBeforeCollapse** : do somthing before when the content is collapsed

**onAfterCollapse** : do something after when the content is collapsed


##Creating Module
IEA modules are the main component which enables you to create application modules. A iea component is also a iea module with the exception of having `UI.` prefixed with the module name. 

**Example for creating a iea component**

```js
define(function() { 
'use strict'; 
    var Video = IEA.module('UI.video', function(video, app, IEA) {                       
        _.extend(video,{ 
                // iea view logic goes inside 
        }); 
    }); 
return Video; 
}); 

```

**Usage**
```HTML
<div data-role="video" data-path="/data/video.json"></div>
```

**Example for creating a iea general module**
```js
define(function() { 
'use strict'; 
    var module = IEA.module(‘mymodule', function(module, app, IEA){           
        callFunction: function() {
            // do something
        }
    }); 
return module; 
}); 

```

**Usage**
```js
var module = app.myModule() 
    module.callfunction();

```
IEA component modules are auto intialized based on the html markup whereas a general module can be used by just getting the instance my fetching it from the app scope.

All iea module will have default arguments send to the module function which includes **reference to the module itself, the application reference and IEA instance**. In addition it also passes reference of **jQuery and underscore** incase you want to use them (these will be more applicable if you are writing your code in a non AMD principle)

##Creating services
There is no major difference between IEA.module and IEA.service. the only difference is that the former creates a singleton object where as the latter creates new instance everytime you call it.

**Example for creating a iea service**

```js
define(function() { 
'use strict'; 
    var service = IEA.service(‘myservice', function(){
            // service code goes here
    }); 

    return service; 
}); 

```

**Usage**
```js
var service = app.myservice() // creates new instance
service.callfunction();

```

##Out-of-box services
IEA out-of-box comes with some services which can be used directly when creating application

**Tooltip** : Tooltip service enable you to add tooltip into your application component. 

**Usage**


```js
    //creating new instance of tootltip
    var  tooltip = IEA.tooltip(element) // default configuration & element can be string or jQuery Object
    ex. IEA.tooltip('.class-elem')
    or
    IEA.tooltip('#class-elem')
    or
    IEA.tooltip($('.class-elem')
    NOTE: to use it with default config, do add 'title' attribute to your HTML element
    or
    var  tooltip = IEA.tooltip(element, {theme: 'my-custom-theme'}) // initialization with congiruation

    //creating new instance of tootltip with content as markup
    var  tooltip = IEA.tooltip(element, {content: '<div> Tooltip content as markup</div>', contentAsMarkup: true})

    // creating tooltip instance with cross icon
    var  tooltip = IEA.tooltip(element, {trigger: 'click'})
```

**Methods**
- show
- hide
- disable
- enable
- destroy
- content
- updateContent
- reposition
- getTooltipElement
- getIconElement

**Slider** : Slider service enable you to create carousel components with overridable defaults.

**Usage**

```js
    //creating new instance of slider
    var  slider = IEA.slider(element, config) // default configuration
    or
    var  slider = IEA.slider(elemnt, {auto: true}) // initialization with congiruation

    // start the carousel
    slider.enable();
```
**Methods**
- disable();
- distroy();
- reload(); // just reload with set config
- reload({auto: false}); // reload the carousel with new configuration
- getCurrentSlide();
- getSlideCount();
- play();
- pause()

**Events**
- slider:load
- slide:before
- slide:after
- slide:next
- slide:prev

**video** : Video serice which enables to create video component. Currently video component supports Youtube, BrightCove and Vimeo players

**Usage**


```js
    //creating new instance of video
    var video = IEA.video(container, config)
```

**Methods**
- getVideoContainer()
- getPlayer()
- play()
- pause()
- stop()
- destroy()
- restart()
- seek()
- resize()


**Popup** : Popup service enables to create popup in component in a no of ways 

**Usage**

```js
    // create new instance for popup
    var popup = IEA.popup() // default configuraion
    or
    var popup = IEA.popup({type:inline}) // intialization with configuration

    // open popup image
    popup.open("http://path/to/image/jpg","image");

    // open popup inline content
    popup.open($('element'),'inline');

    // open poup with IEA Model
    var model = IEA.model([
          {
            src: 'path-to-image-1.jpg'
          },
          {
            src: 'http://vimeo.com/123123',
            type: 'iframe' // this overrides default type
          },
          {
            src: $('<div>Dynamically created element</div>'), // Dynamically created element
            type: 'inline'
          },
          {
            src: '<div>HTML string</div>',
            type: 'inline'
          },
          {
            src: '#my-popup', // CSS selector of an element on page that should be used as a popup
            type: 'inline'
          }
        ])
    popup.open(model);
    popup.close();
```
**Events**
- popup:open
- popup:close

##Creating Collection

Collections are ordered sets of models.

**Create Collection manually**

Add collection file to designated place.

**Example: **

Create a helloWorld Collection by adding files in the below locations

- */app/js/collection/helloWorld.js*


**Create your collection using the generator:**

Using the iea generator to create the collection by using the below syntax

`yo iea:collection [name]`

**Example: **

`yo iea:collection helloWorld`

After sucessfull execution of generator you should get files created is required locations as below

- */app/js/collection/helloWorld.js*

---

##Creating Model

Models contains the interactive data as well as the logic surrounding it.

**Create Model manually**

Add model file to designated place.

**Example: **

Create a helloWorld Model by adding files in the below locations

- */app/js/model/helloWorld.js*


**Create your model using the generator:**

Using the iea generator to create the model by using the below syntax

`yo iea:model [name]`

**Example: **

`yo iea:model helloWorld`

- */app/js/model/helloWorld.js*

---

##Creating Module

Module contains logically seperated code in one section.

**Create Module manually**

Add module file to designated place.

**Example: **

Create a helloWorld Module by adding files in the below locations

- */app/js/module/helloWorld.js*


**Create your module using the generator:**

Using the iea generator to create the module by using the below syntax

`yo iea:module [name]`

**Example: **

`yo iea:module helloWorld`

- */app/js/module/helloWorld.js*

---

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

##Troubleshooting

1. `gem install compass` fails and shows error saying SSL connection problem 

Ruby gem installation failes due to certificate issue.

```shell
$ gem install compass
ERROR: Could not find a valid gem 'compass' (>= 0), here is why:
          Unable to download data from https://rubygems.org/ - SSL_connect retur
ned=1 errno=0 state=SSLv3 read server certificate B: certificate verify failed (
https://rubygems.org/latest_specs.4.8.gz)

```
The problem is due to expired rubygem certificate. The new certificate needs to be added manually to regain the access. you can refer the link and get the new certificate added [SSL upgrades on rubygems.org and RubyInstaller versions](https://gist.github.com/luislavena/f064211759ee0f806c88)

1. `bower install` fails to complete the installation and shows error *fatal: unable to connect to github.com:*

```shell
    Additional error details:
    fatal: unable to connect to github.com:
    github.com[0: 192.30.252.131]: errno=No error

```

The problem happends when there is firewall bocking the request going to git://. To solve this problem we have to change the Protocol to http:// 

To do that you can change the git global configuration to change all git:// request to http:// using below configuration change

```shell
    git config --global url."https://github.com/".insteadOf git@github.com:
    git config --global url."https://".insteadOf git://
```

1. `bower install` failes to complete

There are chances that the bower install does not complete due to network timeouts. Bower needs a continuous highspeed connection open to download and install all the required front-end dependencies. in case the network is slow. There is a high probabilty that the process will not complete successfully. 


**Troubleshooting**

- Check if you network speed is adequate for download all the assets. 
- Try switching the network and then try running the command
- Try connecting your computer to LAN cable rather than WIFI and check if that helps.

1. `grunt build` failes with error at `imagemin` process. Error says **Fatal error: This socket is closed.**

```shell
Running "imagemin:dist" (imagemin) task
Fatal error: This socket is closed.
```

The issue occurs after the node js is upgraded to newer version v0.10.33+. There is a defect on the same open with vendor on the same [273](https://github.com/gruntjs/grunt-contrib-imagemin/issues/273).

##Open Issues 

1. CSS extendible but there should be “template.scss” file which I found missing (required for header/footer etc)
1. Found it difficult to handle/ change responsive behavior; a document would be helpful
1. Navigation component is complex to extend in defferent scenarios for whitehouse/iea.com due to the way the iea version is constructed.
1. Component extension hooks and options are not documented.
1. All services and modules in the architecture should have to be documented as currently is very hard to know how to you any of them
1. Architecture error logic mechanism needs to be put in place. Many time its very hard to find the root cause of the problem.
1. Social media components needs to be much more configurable and easy to use.
1. Very difficult to test serverside component in the local during component  development. Need to create a mechanism to do that.
1. The AEM uses flexible template should be generated from frontend and should be delivered as part of the build.
1. There should be some option to enable extending of the server side components like column control and tabbed component to add addition classes or id to it. currently only CQ authoring dialog for column control has this option to add classes.
1. Some of the complex components like Content results grid , Related Content, Form is very hard to extend due to the complexity and the limited extension hooks provided.
1. More usecases needs to be brought into picture and more extension points needs to be exposed to cater more solutions.
1. Page created during development of component vs page created by authoring in CQ varies drastically due to the way the base layout , column controls and other parsys and iparsys and added into the page. 
1. The pages should avoid exposing the parsys blocks in HTML as in certain scenarios, the components needs to know about its parent element (like tab component) and having more and more nesting structure makes it hard to find the exact element.
1. More and more nested CQ authoring structure creates more JS performance problem as the js needs to read through the markup very often to find elements, the more markup , slower the traversal.
1. A page should be created using the already existing IEA components by customizing it or create new components specific to the requirement rather than trying to combine more than one components to create a impression of a component. This would create bad code as well it would be hard to manage and organize these codes.
1. Each components added into the CQ page **MUST HAVE** a semantic classname added to it to identify them. these styles would be necessary for the UI part to style the component accordingly and not creating the css which is global and could affect other component styles.
1. IEA `grunt build` fails in MAC and shows error with regards to opening file. The problem seems to be happening from the permission side as node is not allowed to read files. 


---
@author : Anooj Ayyappan


