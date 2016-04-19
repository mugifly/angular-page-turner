'use strict';

angular.module('ExampleApp', ['PageTurner'])

.controller('ExampleController', ['$log', 'PageTurner',
function ($log, PageTurner) {

	var vm = this;
	vm.numOfPages = PageTurner.numOfPages - 1;
	vm.pageId = PageTurner.pageId;


	/**
	 * Add the example page
	 */
	vm.addExamplePage = function () {

		vm.numOfPages = PageTurner.getNumOfPages();

		PageTurner.addPage({
			template: '<h1>' + vm.numOfPages + 'th page</h1>'
		});

	};


	/**
	 * Open the previous page
	 */
	vm.openPrevPage = function () {

		PageTurner.openPrevPage();
		vm.pageId = PageTurner.getPageId();
		vm.numOfPages = PageTurner.getNumOfPages() - 1;

	};


	/**
	 * Open the next page
	 */
	vm.openNextPage = function () {

		PageTurner.openNextPage();
		vm.numOfPages = PageTurner.getNumOfPages() - 1;

	};


	/**
	 * Open the page as random
	 */
	vm.openRandomPage = function () {

		vm.numOfPages = PageTurner.getNumOfPages() - 1;
		vm.pageId = Math.floor(Math.random() * vm.numOfPages);

		PageTurner.openPage(vm.pageId);

	};


	/**
	 * Event handler - Page changed
	 * @param  {Integer} page_id ID of the page
	 */
	vm.onPageChanged = function (page_id) {

		$log.debug('Page changed!', page_id);

	};


}])

;
