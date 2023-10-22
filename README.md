# Quill-Jquery-Enhanced

Simple jquery plugin to provide helper functions for creating a quill editor with built in render/preview functionality. 

Rendering is done with quill-delta-to-html library

This is pretty niche to what I needed in my current project with my current requirements and codebase. Maybe it's useful to someone else. 

If there's interest I can rewrite to be a more modular plugin. 

## What this does

Importing this plugin adds the following jQuery methods:  
* `$.toQuill(quillOpts)` - bulk of the plugin. Applies quill instantiation to the selector. By default adds a toolbar with some minimal features. Wraps the editor and toolbar in a `.ql-wrapper`, creates a sibling to the wrapper `.ql-preview` and wraps the preview and wrapper with a `.ql-parent` container. Additionally, the ql-container element gets jquery data property `quill` set that holds the quill object for easy reference. Lastly, runs the `showTooltips()` function which applies `title` attributes to all tooltip elements.  
    * You can provide your own editor configuration by passing it to the method. Currently the options are not combined, so you'll need to specify everything if you want to change it.
    * If you have an existing quill delta, you can set it as the child to the editor element, it will be extracted and set as the editor contents. Useful if you're recalling an existing quill delta. 
* `$.quill()` - returns the quill object that was created on the element. Shorthand for `$(ele).data('quill')` 

Also modifies the Quill prototype to have:  
* `.toHtml()` - returns the html rendering of the quill delta using the quill-delta-to-html library  
* `.togglePreview()` - generates the html from the current contents, hides the editor and toolbar, and displays the html in the `.ql-preview` element  
* `.showTooltips()` - iterates over the `.ql-tooltip` sibling and applies a standard `title` attribute to improve accessibility. This is called automatically when `$.toQuill()` is called.

### Usage

Make sure you have an import for quill and quill.snow.css in your project. Additionally, you need to have the quill-delta-to-html library in the project. As of writing this readme, I downloaded the bundle.js from the repo's `dist/browser` into my project and import it using the following:

```html
<!-- Dependencies -->
<link href="https://cdn.quilljs.com/1.2.3/quill.snow.css" rel="stylesheet" />
<script src="https://cdn.quilljs.com/1.2.3/quill.js"></script>

<script src="js/QuillDeltaToHtmlConverter.bundle.js"></script>
<script src="js/quill-jquery-enhanced.js"></script>
```

Then it can be called using:

```javascript
$(document).ready(()=>{
    $('.quill-editor').toQuill()
})
```

where `.quill-editor` is a single element with no children. This will modify that element to have a parent wrapper, a preview container, the the quill editor itself, and the toolbar container. 

For example:

```html
<div class='quill-editor'></div>
```

will become:

```html
<div class='ql-parent'>
    <div class='ql-preview'></div>
    <div class='ql-wrapper'>
        <div class='quill-toolbar ql-snow'>...</div>
        <div class='quill-editor ql-container ql-snow'>...</div>
    </div>
</div>
```
