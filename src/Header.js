function Header(calendar, options) {
	var t = this;

	// exports
	t.render = render;
	t.destroy = destroy;
	t.updateTitle = updateTitle;
	t.activateButton = activateButton;
	t.deactivateButton = deactivateButton;
	t.disableButton = disableButton;
	t.enableButton = enableButton;

	// locals
	var element = $([]);
	var tm;

	function render() {
		tm = options.theme ? 'ui' : 'fc';
		var sections = options.header;
		if (sections) {
			element = $("<table class='fc-header' style='width:100%'/>").append($("<tr/>").append(renderSection('left')).append(renderSection('center')).append(renderSection('right')));
			return element;
		}
	}

	function destroy() {
		element.remove();
	}

	function renderSection(position) {
		var o = $('<td class="' + position + '"></td>');

		var buttonStr = options.header[position];
		if (buttonStr) {
			$.each(buttonStr.split(' '), function(i) {
				var prevButton;
				var e = $('<div class="btn-group"  data-toggle="' + (position === 'right' ? 'buttons-radio' : '') + '"></div>').appendTo(o);
				$.each(this.split(','), function(j, buttonName) {
					var bClass = [
							'btn', 'btn-primary'
					];
					if (buttonName == 'title') {
						e.append("<span class='fc-header-title'><h2>&nbsp;</h2></span>");
						prevButton = null;
					} else {
						var buttonClick;
						var text;
						if (calendar[buttonName]) {
							buttonClick = calendar[buttonName]; // calendar
							// method
						} else if (fcViews[buttonName]) {
							buttonClick = function() {
								button.removeClass(tm + '-state-hover'); // forget
								// why
								calendar.changeView(buttonName);
							};
							if (buttonName === options.defaultView) {
								bClass.push('active');
							}
						} else if (options.customButtons[buttonName]) {
							var b = options.customButtons[buttonName];
							buttonClick = function() {
								if (b.onClick) {
									b.onClick.call(calendar);
								}
							}
							if (b.title) {
								text = b.title;
							}
						}

						if (buttonClick) {
							var icon = options.theme ? smartProperty(options.buttonIcons, buttonName) : null; // why
							// are
							// we
							// using
							// smartProperty
							// here?

							text = text || smartProperty(options.buttonText, buttonName); // why
							// are
							// we
							// using
							// smartProperty
							// here?
							/*
							 * var button = $( "<span class='btn fc-button fc-button-" +
							 * buttonName + " " + tm + "-state-default'>" + "<span
							 * class='fc-button-inner'>" + "<span class='fc-button-content'>" +
							 * (icon ? "<span class='fc-icon-wrap'>" + "<span class='ui-icon
							 * ui-icon-" + icon + "'/>" + "</span>" : text ) + "</span>" + "<span
							 * class='fc-button-effect'><span></span></span>" + "</span>" + "</span>" );
							 */
							var button = $('<button class="' + bClass.join(' ') + ' fc-button fc-button-' + buttonName + '"><span>' + text + '</span></button>');
							if (button) {
								button.click(function() {
									if (!button.hasClass(tm + '-state-disabled')) {
										buttonClick();
									}
								}).appendTo(e);
								/*
								 * .mousedown(function() { button .not('.' + tm +
								 * '-state-active') .not('.' + tm + '-state-disabled')
								 * .addClass(tm + '-state-down'); }) .mouseup(function() {
								 * button.removeClass(tm + '-state-down'); }) .hover( function() {
								 * button .not('.' + tm + '-state-active') .not('.' + tm +
								 * '-state-disabled') .addClass(tm + '-state-hover'); },
								 * function() { button .removeClass(tm + '-state-hover')
								 * .removeClass(tm + '-state-down'); } )
								 */
								;
								prevButton = button;
							}
						}
					}
				});
				e.button();
			});
		}

		return o;
	}

	function updateTitle(html) {
		element.find('h2').html(html);
	}

	function activateButton(buttonName) {
		element.find('.fc-button-' + buttonName).addClass('active');
	}

	function deactivateButton(buttonName) {
		element.find('.fc-button-' + buttonName).removeClass('active');
	}

	function disableButton(buttonName) {
		element.find('.fc-button-' + buttonName).addClass('disabled');
	}

	function enableButton(buttonName) {
		element.find('.fc-button-' + buttonName).removeClass('disabled');
	}

}