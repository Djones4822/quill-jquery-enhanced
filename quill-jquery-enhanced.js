import { QuillDeltaToHtmlConverter } from "https://esm.sh/quill-delta-to-html"; 

Quill.prototype.getHtml = function () {
    const delta = this.getContents()
    const ops = delta['ops']
    const converter = new QuillDeltaToHtmlConverter(ops, {})
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

(function ($) {
    /** Jquery function to easily set an element as a quill editor, optionally provide the quill options if needed */
    $.fn.toQuill = function (editorOpts) {
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
            if (delta) { quill.setContents(delta) }
            $(this).data('quill', quill)  // store the editor in the quill data attr
        })
    }
    /** Jquery function to easily get the quill object from an element */
    $.fn.quill = function () { return this.data('quill') }
}(jQuery));