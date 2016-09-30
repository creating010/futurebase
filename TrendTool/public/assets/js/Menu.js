/**
 * Menu
 * @author Nathan van Helden
 */
var Menu = function(options){this.init(options);};

Menu.prototype =
{
	/**
	 * Constructor
	 * @param	object options
	 * @return	void
	 */
	init: function(options)
	{
		this.options =
		{
			selector	: '.menu',
			init		: true
		};
		
		$.extend(this.options, options);
		
		this.window		= $(window);
		this.body_node	= $('body');
		
		this.size		= null;
		this.transition	= (typeof document.body.style.transition !== 'undefined');
		
		this.start();
	},
	
	/**
	 * Start
	 * @return void
	 */
	start: function()
	{
		var _this		= this;
		var selectors	= this.options.selector.split(',');
		
		if (selectors.length > 1)
		{
			for (var x in selectors)
			{
				var options = $.extend({}, this.options);
				
				options.selector = $.trim(selectors[x]);
				
				new Menu(options);
			}
		}
		else
		{
			var menu_nodes = $(this.options.selector);
			
			menu_nodes.each(function(index)
			{
				if (index)
				{
					var options = $.extend({}, _this.options);
					
					options.selector	+= ':eq('+index+')';
					options.init	 	 = false;
					
					new Menu(options);
				}
				else
				{
					_this.menu_node = $(this);
					
					_this.setSize();
					_this.setEvents();
				}
			});
		}
	},
	
	/**
	 * Set size
	 * @return void
	 */
	setSize: function()
	{
		this.body_node.css('overflow', 'hidden');
		
		var window_width = this.window.width();
		
		this.body_node.css('overflow', '');
		
		var new_size = window_width < 1024 ? 'small' : 'large';
		
		if (this.size != new_size)
		{
			this.size = new_size;
			
			return true;
		}
		
		return false;
	},
	
	/**
	 * Set events
	 * @return void
	 */
	setEvents: function()
	{
		var _this			= this;
		var page_node		= this.menu_node.parents('.page:first');
		var handler_node	= this.menu_node.find('.handler:first');
		var listener_node	= handler_node.next('[class*="mobile-menu"]');
		var outer_node		= listener_node.find('.outer:first');
		var inner_node		= listener_node.find('.inner:first');
		
		if (this.options.init)
		{
			this.window.resize(function()
			{
				var is_aside = page_node.hasClass('aside');
				
				if (_this.setSize() && is_aside)
				{
					page_node.removeClass('aside');
					
					if (!_this.transition) page_node.trigger('classchange');
				}
			});
		}
		
		page_node.bind('classchange', function()
		{
			var is_aside = page_node.hasClass('aside');
			
			if (!is_aside) listener_node.trigger('reset');
		});
		
		if (this.transition)
		{
			page_node.bind('transitionend', function(event)
			{
				if ($(event.target).is(page_node)) page_node.trigger('classchange');
			});
		}
		
		handler_node.click(function(event)
		{
			event.preventDefault();
			
			var is_aside = page_node.hasClass('aside');
			
			if (is_aside)
			{
				page_node.removeClass('aside');
				
				if (!_this.transition) page_node.trigger('classchange');
			}
			else
			{
				page_node.before(listener_node).addClass('aside');
				
				var outer_width		= outer_node.outerWidth();
				var inner_width		= inner_node.outerWidth();
				var scrollbar_width	= outer_width - inner_width;
				
				outer_width += scrollbar_width;
				
				outer_node.width(outer_width);
				
				handler_node.addClass('active');
			}
		});
		
		listener_node.bind('reset', function()
		{
			handler_node.removeClass('active').after(listener_node);
			
			outer_node.css('width', '');
		});
	}
};