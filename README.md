jquery.validate.unobtrusive.dynamic
====================================

# Applying unobtrusive jquery validation to dynamic content in ASP.Net MVC

The new unobtrusive validation features of ASP.net MVC are great, but I was surprised to find that once the validators have been applied for a document, validators as a result of dynamic content will not be applied, even if you call `$.validator.unobstrusive.parse`

The Microsoft `jquery.validate.unobtrusive` library calls the jquery `.validate` method on the relevant form. Inside this method, it does nothing if the form already has a validator attached, so any parsed rules will be ignored.

This is small extension

##Examples

For example parse dynamic content like:

    $.validator.unobtrusive.parseDynamicContent('input.something');

I also added the ability to remove rules for elements you remove from the dom. So, when you remove elements from the Dom and you want those validation rules removed also then call

    $.validator.unobtrusive.unparseContent('input.something');
	
You cal always reparse whole `FORM` with

    $("form").data("unobtrusiveValidation", null);
    $("form").data("validator", null);
    $.validator.unobtrusive.parse($("form"));	  
   