/**
 * angular-page-turner
 * https://github.com/mugifly/angular-page-turner
 * (C) 2016 - Masanori Ohgita; Released under MIT License.
 */

'use strict';

angular.module('PageTurner', [])

.directive('pageTurner', ['$timeout', function ($timeout) {

	var PAGE_CHANGE_ANIMATION_SEC = 0.5;

	return {

		// Define as Element or Attribute or Class
		restrict: 'C',

		// Include the children
		transclude: false,

		// Controller
		controller: ['$scope', function ($scope) {

			$scope.internalMethods = {};


			$scope.addPage = function () {

			};

			/**
			 * Change the current page
			 * @param {Integer} page_id ID of the page
			 */
			$scope.setPage = function (page_id) {

				$scope.currentPageId = page_id;
				$scope.internalMethods.drawPages(false);

			};

		}],

		// Initialization function
		link: function (scope, elem, attrs, ctrl) {

			var options = {
				pageChangeAnimationSec: PAGE_CHANGE_ANIMATION_SEC
			};

			var $elem = angular.element(elem[0]);
			var $pages = $elem.children('.page');

			scope.currentPageId = 0;

			// ----


			/**
			 * Draw the pages
			 * @param is_initial Flag for initialization. It will attach the event handlers.
			 */
			scope.internalMethods.drawPages = function(is_initial) {

				var page_id = 0, num_of_pages = $pages.length;
				angular.forEach($pages, function (page_elem) {

					var $page = angular.element(page_elem);

					// Whether the page is already flipped
					var is_flipped = (page_id < scope.currentPageId);

					// Whether the page is front
					var is_active = (page_id == scope.currentPageId || page_id == scope.currentPageId - 1);

					// Whether the page is either side
					var is_left = false;
					if (page_id == 0 || page_id % 2 == 0) {
						$page.removeClass('left-page');
						$page.addClass('right-page');
					} else {
						is_left = true;
						$page.addClass('left-page');
						$page.removeClass('right-page');
					}

					// Whether the page should be reversed
					var is_reversed = false;
					if (page_id % 2 == 0 && is_flipped && !is_active) {
						$page.addClass('left-reversed-page');
						is_reversed = true;
					} else if (page_id % 2 != 0 && !is_flipped && !is_active) {
						$page.addClass('right-reversed-page');
						is_reversed = true;
					} else {
						$page.removeClass('left-reversed-page');
						$page.removeClass('right-reversed-page');
					}

					// Activate the page
					if (page_id == scope.currentPageId - 1) {
						$page.addClass('active-page');
						$page.css('z-index', 1000);
						$page.css('left', '0px');
					} else if (page_id == scope.currentPageId) {
						$page.addClass('active-page');
						$page.css('z-index', 1000);
						$page.css('right', '0px');
					} else {
						// Not activated page
						$page.removeClass('active-page');
						if (is_flipped) {
							$page.css('z-index', page_id);
						} else {
							$page.css('z-index', num_of_pages - page_id);
						}
					}

					// Representing the rest of the pages with using the gap of pages
					if (!is_reversed && !is_active) {
						if (is_flipped) {
							$page.css('left', page_id * -1 + 'px');
							$page.css('right', 'auto');
						} else {
							$page.css('right', page_id * -1 + 'px');
							$page.css('left', 'auto');
						}
					}

					// Set the id and event handler
					if (is_initial) {

						$page.data('pageId', page_id);

						$page.bind('click', function() {

							var $elem = angular.element(this);
							scope.internalMethods.onPageClicked($elem);

						});
					}

					page_id++;

				});

				$timeout(function () {

					angular.forEach($pages, function (page_elem) {
						var $page = angular.element(page_elem);
						$page.css('transition', 'all ' + options.pageChangeAnimationSec + 's linear');
					});

				}, 100);

			};


			/**
			 * On page clicked
			 * @param  {Object} $elem jqLite element of the page
			 */
			scope.internalMethods.onPageClicked = function($elem) {

				var page_id = $elem.data('pageId');

				var next_page_id = -1;
				var is_from_left = $elem.hasClass('left-page');
				if (is_from_left) { // Left to Right
					next_page_id = page_id - 1;
				} else { // Right to Left
					next_page_id = page_id + 2;
				}

				scope.setPage(next_page_id);

			};


			// ----

			scope.internalMethods.drawPages(true);

		},

		// Make a scope
		scope: {
			addPage: '&'
		}

	};
	
}])

;
