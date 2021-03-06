/**
 * Global JavaScript for Compass
 *
 * Includes all JS which is required within all sections of the theme.
 */
window.compass = window.compass || {};

(function( window, $, undefined ) {
	'use strict';

	var $window   = $( window ),
		$document = $( document ),
		$body     = $( 'body' ),
		compass   = window.compass;

	$.extend( compass, {

		//* Global script initialization
		globalInit: function() {
			var $videos = $( '#site-inner' );
			$body.addClass( 'ontouchstart' in window || 'onmsgesturechange' in window ? 'touch' : 'no-touch' );
			$document.gamajoAccessibleMenu();
			$videos.fitVids();
		},

		mobileMenu: function() {
			var menuSelectors = [],
				menuSide      = $body.hasClass( 'rtl' ) ? 'left' : 'right',
				name          = 'sidr-main',
				sidrOpen      = null,
				sidrClose     = null,
				siteContainer = $( '#site-container' ),
				menuButton    = $( '<button type="button" id="responsive-menu-button" class="menu-button" aria-expanded="false"></button>' );

			if ( 0 !== $( '#menu-primary' ).length ) {
				menuSelectors.push( '#menu-primary' );
			}

			if ( 0 !== $( '#menu-secondary' ).length ) {
				menuSelectors.push( '#menu-secondary' );
			}

			//* End here if we don't have a menu.
			if ( 0 === menuSelectors.length ) {
				return;
			}

			//* Add a responsive menu button.
			$( '#branding' ).before( menuButton );

			sidrOpen = function() {
				var navEl        = $( '#' + name ),
					navItems     = $( '#' + name + ' a' ),
					firstNavItem = navItems.first(),
					lastNavItem  = navItems.last();

				menuButton.toggleClass( 'activated' ).attr( 'aria-expanded', true );

				siteContainer.on( 'click.CloseSidr', function( event ) {
					$.sidr( 'close', name );
					event.preventDefault();
				});

				// Add some attributes to the menu container.
				navEl.attr({ role: 'navigation', tabindex: '0' }).focus();

				// When focus is on the menu container.
				navEl.on( 'keydown.sidrNav', function( event ) {
					// If it's not the tab key then return.
					if ( 9 !== event.keyCode ) {
						return;
					}
					// When tabbing forwards and tabbing out of the last link.
					if ( lastNavItem[0] === event.target && ! event.shiftKey ) {
						menuButton.focus();
						return false;
					// When tabbing backwards and tabbing out of the first link OR the menu container.
					} else if ( ( firstNavItem[0] === event.target || navEl[0] === event.target ) && event.shiftKey ) {
						menuButton.focus();
						return false;
					}
				});

				// When focus is on the toggle button.
				menuButton.on( 'keydown.sidrNav', function( event ) {
					// If it's not the tab key then return.
					if ( 9 !== event.keyCode ) {
						return;
					}
					// when tabbing forwards
					if ( menuButton[0] === event.target && ! event.shiftKey ) {
						navEl.focus();
						return false;
					}
				});
			};

			sidrClose = function() {
				menuButton.toggleClass( 'activated' ).attr( 'aria-expanded', false );
				siteContainer.off( 'click.CloseSidr' );
				// Remove the toggle button keydown event.
				menuButton.off( 'keydown.sidrNav' );
			};

			//* Sidr menu init.
			menuButton.sidr( {
				name:     name,
				renaming: false,
				side:     menuSide,
				source:   menuSelectors.toString(),
				onOpen:   sidrOpen,
				onClose:  sidrClose
			});

			//* Close sidr menu if open on larger screens
			$window.resize(function() {
				if ( window.innerWidth >= 1024 ) {
					$.sidr('close', 'sidr-main');
					menuButton.attr( 'aria-expanded', false );
				}
			});
		}

	});

	// Document ready.
	jQuery(function() {
		compass.globalInit();
		compass.mobileMenu();
	});
})( this, jQuery );
