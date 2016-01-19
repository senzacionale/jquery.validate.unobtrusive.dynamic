$.validator.unobtrusive.parseDynamicContent = function (selector) {
    var $selector = $(selector),
        $jqValUnob = $.validator.unobtrusive,
        selectorsDataValAttr = $selector.attr('data-val'),
        $validationInputs = $selector.find(':input[data-val=true]');

    if ((selectorsDataValAttr !== 'true') && 
        ($validationInputs.length === 0)) { 
        return; 
    }

    if (selectorsDataValAttr === 'true') {
        $jqValUnob.parseElement(selector, true);
    }

    $validationInputs.each(function () {
        $jqValUnob.parseElement(this, true);
    });

    //get the relevant form
    var $form = $selector.first().closest('form');

    $jqValUnob.syncValdators($form);
};

/* synchronizes the unobtrusive validation with jquery validator */
$.validator.unobtrusive.syncValdators = function ($form) {
    if ($.hasData($form[0])) {
        var unobtrusiveValidation = $form.data('unobtrusiveValidation'),
            validator = $form.validate();

        // add validation rules from unobtrusive to jquery
        $.each(unobtrusiveValidation.options.rules, function (elname, elrules) {
            if (validator.settings.rules[elname] == undefined) {
                var args = {};
                $.extend(args, elrules);
                args.messages = unobtrusiveValidation.options.messages[elname];
                $("[name='" + elname + "']").rules("add", args);
            } else {
                $.each(elrules, function (rulename, data) {
                    if (validator.settings.rules[elname][rulename] == undefined) {
                        var args = {};
                        args[rulename] = data;
                        args.messages = unobtrusiveValidation.options.messages[elname][rulename];
                        $("[name='" + elname + "']").rules("add", args);
                    }
                });
            }
        });
        // remove all validation rules from jquery that arn't in unobtrusive
        $.each(validator.settings.rules, function (elname, elrules) {
            if (unobtrusiveValidation.options.rules[elname] === undefined) {
                delete validator.settings.rules[elname];
            } else {
                $.each(elrules, function (rulename, data) {
                    if (rulename !== "messages" && unobtrusiveValidation.options.rules[elname][rulename] === undefined) {
                        delete validator.settings.rules[elname][rulename];
                    }
                });
            }
        });
    }        
};

$.validator.unobtrusive.unparseContent = function (selector) {
    var $selector = $(selector);

    // if its  a text node, then exit
    if ($selector && $selector.length > 0 && $selector[0].nodeType === 3) {
        return;
    }

    var $form = $selector.first().closest('form'), 
        unobtrusiveValidation = $form.data('unobtrusiveValidation');

    $selector.find(":input[data-val=true]").each(function () {
        removeValidation($(this), unobtrusiveValidation);
    });
    if ($selector.attr('data-val') === 'true') {
        removeValidation($selector, unobtrusiveValidation);
    }
    $.validator.unobtrusive.syncValdators($form);
};

function removeValidation($element, unobtrusiveValidation) {
    var elname = $element.attr('name');
    if (elname !== undefined) {
        $element.rules('remove');
        if (unobtrusiveValidation) {
            if (unobtrusiveValidation.options.rules[elname]) {
                delete unobtrusiveValidation.options.rules[elname];
            }
            if (unobtrusiveValidation.options.messages[elname]) {
                delete unobtrusiveValidation.options.messages[elname];
            }
        }
    }
}