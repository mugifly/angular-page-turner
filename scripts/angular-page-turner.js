/**
 * angular-page-turner
 * https://github.com/mugifly/angular-page-turner
 * (C) 2016 - Masanori Ohgita; Released under MIT License.
 */

'use strict';

angular.module('PageTurner', [])


/**
 * Service for manipulate the directive from the controller of user's app
 */

 .factory('PageTurner', ['$rootScope', function($rootScope) {

	var service = {
		numOfPages: 0,
		pageId: 0
	};


	/**
	 * Add the page
	 * @return {Integer} ID of the new page
	 */
	service.addPage = function (args) {

		var class_names = [];
		if (args.classNames != null) {
			class_names = args.classNames.split(/ /);
		}

		$rootScope.$broadcast('ANGULAR_PAGE_TURNER', {
			cmd: 'addPage',
			template: args.template,
			classNames: class_names
		});
	};


	/**
	 * Change the page
	 * @param  {Integer} page_id ID of the page
	 */
	service.openPage = function (page_id) {

		$rootScope.$broadcast('ANGULAR_PAGE_TURNER', {
			cmd: 'openPage',
			pageId: page_id
		});

	};


	/**
	 * Change the page to previous
	 */
	service.openPrevPage = function () {

		if (service.pageId <= 0) return;

		$rootScope.$broadcast('ANGULAR_PAGE_TURNER', {
			cmd: 'openPage',
			pageId: service.pageId - 2
		});

	};


	/**
	 * Change the page to next
	 */
	service.openNextPage = function () {

		if (service.numOfPages - 1 <= service.pageId) return;

		$rootScope.$broadcast('ANGULAR_PAGE_TURNER', {
			cmd: 'openPage',
			pageId: service.pageId + 1
		});

	};


	/**
	 * Get the id of the current page
	 * @return  {Integer} ID of page
	 */
	service.getPageId = function () {
		return this.pageId;
	};


	/**
	 * Get the number of the pages
	 * @return  {Integer} Number of the pages
	 */
	service.getNumOfPages = function () {
		return this.numOfPages;
	};


	return service;

}])


/**
 * Directive for using on template
 */

.directive('pageTurner', ['$timeout', 'PageTurner',
function ($timeout, PageTurner) { // Inject the PageTurner service

	// Default values
	var PAGE_CHANGE_DELAY_SEC = 0.5;


	// Directive
	return {

		// Define as Element or Attribute or Class
		restrict: 'CA',

		// Include the children
		transclude: false,

		// Make a separated scope
		scope: {
			ptOnPageChanged: '&' // pt-on-page-changed attribute is function
		},

		// Controller
		controller: ['$scope', function ($scope) {

			$scope.internalMethods = {};


			/**
			 * Add the new page
			 * @param {String} template Template of the page
			 */
			$scope.addPage = function (template, class_names) {

				$scope.internalMethods.addPage(template, class_names);
				$scope.internalMethods.drawPages(true);

			};

			/**
			 * Change the current page
			 * @param {Integer} page_id ID of the page
			 */
			$scope.openPage = function (page_id) {

				if (page_id % 2 != 0) {
					page_id = page_id + 1;
				}

				if (PageTurner.numOfPages < page_id) return;

				var jumpPage = function(page_id) {

					var current_page = $scope.currentPageId;

					if (current_page < page_id) {
						current_page += 2;
						$scope.currentPageId = current_page;
						$scope.internalMethods.drawPages(false);
					} else if (current_page > page_id) {
						current_page -= 2;
						$scope.currentPageId = current_page;
						$scope.internalMethods.drawPages(false);
					}

					if (current_page == page_id){ // Done
						PageTurner.pageId = current_page;
						$scope.currentPageId = current_page;

						if ($scope.ptOnPageChanged) {
							// Call the callback
							$scope.ptOnPageChanged({ pageId: current_page });
						}

						return;
					}

					$timeout(function () {
						jumpPage(page_id);
					}, $scope.options.pageChangeDelaySec * 1000);

				};

				jumpPage(page_id);

			};


			// ----


			$scope.$on('ANGULAR_PAGE_TURNER', function(event, args) {

				if (args.cmd == 'addPage') {
					$scope.addPage(args.template, args.classNames);
				} else if (args.cmd == 'openPage') {
					$scope.openPage(args.pageId);
				}

			});


		}],


		// Initialization function
		link: function (scope, elem, attrs, ctrl) {

			// Options

			if (attrs.ptIsEnabledChangeOnClick != null && attrs.ptIsEnabledChangeOnClick == 'false') {
				attrs.ptIsEnabledChangeOnClick = false;
			} else {
				attrs.ptIsEnabledChangeOnClick = true;
			}

			scope.options = {
				pageChangeDelaySec: attrs.ptPageChangeDelaySec || PAGE_CHANGE_DELAY_SEC,
				isEnabledChangeOnClick: attrs.ptIsEnabledChangeOnClick
			};

			// ----

			var $container = angular.element(elem[0]);
			var $pages = $container.children('.page');

			scope.currentPageId = 0;

			// ----


			/**
			 * Add the new page
			 * @param  {String} template Template of the page
			 * @param  {Array} class_names  Class names
			 */
			scope.internalMethods.addPage = function(template, class_names) {

				var $page = angular.element('<div/>');
				$page.html(template);
				$page.addClass('page');
				if (class_names != null) {
					for (var i = 0, l = class_names.length; i < l; i++) {
						$page.addClass(class_names[i]);
					}
				}
				$container.append($page);

			};


			/**
			 * Draw the pages
			 * @param is_initial Flag for initialization. It will attach the event handlers.
			 */
			scope.internalMethods.drawPages = function(is_initial) {

				$pages = $container.children('.page');

				var num_of_pages = $pages.length;
				PageTurner.numOfPages = num_of_pages;

				var page_id = 0;
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

						if (scope.options.isEnabledChangeOnClick) {
							$page.bind('click', function() {

								var $elem = angular.element(this);
								scope.internalMethods.onPageClicked($elem);

							});
						}
					}

					page_id++;

				});

				$timeout(function () {

					angular.forEach($pages, function (page_elem) {
						var $page = angular.element(page_elem);
						$page.css('transition', 'all ' + scope.options.pageChangeDelaySec + 's linear');
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

				scope.openPage(next_page_id);

			};


			// ----

			scope.internalMethods.drawPages(true);

		}

	};

}])

;
