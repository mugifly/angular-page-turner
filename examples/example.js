'use strict';

angular.module('ExampleApp', ['PageTurner'])

.controller('ExampleController', ['PageTurner', function (PageTurner) {

	var vm = this;
	vm.numOfPages = PageTurner.numOfPages - 1;
	vm.pageId = PageTurner.pageId;


	/**
	 * Add the example page
	 */
	vm.addExamplePage = function () {

		vm.numOfPages = PageTurner.getNumOfPages() - 1;

		PageTurner.addPage({
			template: '<h1>' + vm.numOfPages + 'th page</h1>'
		});

	};


	/**
	 * Open the page as random
	 */
	vm.openRandomPage = function () {

		vm.numOfPages = PageTurner.getNumOfPages() - 1;
		vm.pageId = Math.floor(Math.random() * vm.numOfPages);

		PageTurner.openPage(vm.pageId);

	};


}])

;