const DEFAULT_QUILL_OPTIONS = {
    modules: {
        toolbar: [
            ['bold', 'italic', 'underline'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['clean']
        ]
    },
    placeholder: 'Add ticket details here...',
    theme: 'snow'
};

const toolbarTooltips = {
    'font': 'Select a font',
    'size': 'Select a font size',
    'header': 'Select the text style',
    'bold': 'Bold',
    'italic': 'Italic',
    'underline': 'Underline',
    'strike': 'Strikethrough',
    'color': 'Select a text color',
    'background': 'Select a background color',
    'script': {
        'sub': 'Subscript',
        'super': 'Superscript'
    },
    'list': {
        'ordered': 'Numbered list',
        'bullet': 'Bulleted list'
    },
    'indent': {
        '-1': 'Decrease indent',
        '+1': 'Increase indent'
    },
    'direction': {
        'rtl': 'Text direction (right to left | left to right)',
        'ltr': 'Text direction (left ro right | right to left)'
    },
    'align': 'Text alignment',
    'link': 'Insert a link',
    'image': 'Insert an image',
    'formula': 'Insert a formula',
    'clean': 'Clear format',
    'add-table': 'Add a new table',
    'table-row': 'Add a row to the selected table',
    'table-column': 'Add a column to the selected table',
    'remove-table': 'Remove selected table',
    'help': 'Show help'
};


Quill.prototype.showTooltips = function() {
    let showTooltip = (which, el) => {
        if (which == 'button') {
            var tool = el.className.replace('ql-', '');
        }
        else if (which == 'span') {
            var tool = el.className.replace('ql-', '');
            tool = tool.substr(0, tool.indexOf(' '));
        }
        if (tool) {
            //if element has value attribute.. handling is different
            //buttons without value
            if (el.value == '') {
                if (toolbarTooltips[tool])
                    el.setAttribute('title', toolbarTooltips[tool]);
            }
            //buttons with value
            else if (typeof el.value !== 'undefined') {
                if (toolbarTooltips[tool][el.value])
                    el.setAttribute('title', toolbarTooltips[tool][el.value]);
            }
            //default
            else
                el.setAttribute('title', toolbarTooltips[tool]);
        }
    };

    let toolbarElement = $(this.container).siblings('.ql-toolbar');
    if (toolbarElement.length) {
        toolbarElement = toolbarElement.eq(0)
        let matchesButtons = toolbarElement.find('button');
        for (let el of matchesButtons) {
            showTooltip('button', el);
        }
        //for submenus inside 
        let matchesSpans = toolbarElement.find('.ql-toolbar > span > span');
        for (let el of matchesSpans) {
            showTooltip('span', el);
        }
    }
}

Quill.prototype.getHtml = function () {
    const delta = this.getContents()
    const ops = delta['ops']
    const converter = new window.QuillDeltaToHtmlConverter(ops, {})
    return converter.convert()
};

Quill.prototype.togglePreview = function () {
    const quill = this
    const quillParent = quill.container.closest('.ql-parent')
    const quillWrapper = quill.container.closest('.ql-wrapper')
    const preview = $(quillParent).children('.ql-preview')

    if (!$(preview).is(':visible')) {
        // update preview with delta from editor
        const previewHtml = quill.getHtml()
        const delta = quill.getContents()
        console.log(previewHtml)
        console.log(delta)
        $(preview).data('delta', delta).html(previewHtml)
    } else {
        // update editor with delta from preview
        const delta = $(preview).data('delta')
        quill.setContents(delta)
    }
    $(quillWrapper).toggle()
    $(preview).toggle()
};

!function ($) {
    /** Jquery function to easily set an element as a quill editor, optionally provide the quill options if needed */
    $.fn.toQuill = function (editorOpts = DEFAULT_QUILL_OPTIONS) {
        return this.each(function () {
            $(this).wrap(() => (
                `<div class="ql-parent">
                    <div class='ql-wrapper'>
                    </div>
                </div>`
            ))
            $(this).closest('.ql-parent').prepend(`<div class='ql-preview' style='display:none'></div>`)
            let delta = $(this).data('init-delta') || {}
            let quill = new Quill(this, editorOpts)
            quill.showTooltips()

            if (delta) { quill.setContents(delta) }
            $(this).data('quill', quill)  // store the editor in the quill data attr
        })
    }
    /** Jquery function to easily get the quill object from an element */
    $.fn.quill = function () { return this.data('quill') }
}(jQuery);