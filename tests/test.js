// Load the PageTurner module

beforeEach(module('PageTurner'));

// Prepare the AngularJS services
var $compile, $rootScope;
beforeEach(inject(function (_$compile_, _$rootScope_) {

	$compile = _$compile_;
	$rootScope = _$rootScope_;

}));

// Prepare the base template
var baseTmpl = '\
<div class="page-turner">\
	<div class="page">\
		First page\
	</div>\
</div>';

// Test - Basic test
describe('Basic test', function () {


	it('Initialization', function () {

		var element = $compile(baseTmpl)($rootScope);
		$rootScope.$digest(); // Process the data binding as explicitly

		expect(element.html()).toMatch(/class="page right-page active-page"/);

	});


});


// Test for PageTurner service
describe('Service test', function () {

	var next_page_tmpl = '\
<div class="page">\
Second page\
</div>';


	it('Add page', inject(function (PageTurner) {

		var element = $compile(baseTmpl)($rootScope);
		$rootScope.$digest();

		PageTurner.addPage({
			template: next_page_tmpl,
			classNames: 'test-page'
		});

		expect(element.html()).toMatch(/Second page/);

	}));


	it('Open page', inject(function (PageTurner) {

		var element = $compile(baseTmpl)($rootScope);
		$rootScope.$digest();

		PageTurner.openPage(0);

		expect(element.html()).toMatch(/active-page/);

	}));


	it('Get page id', inject(function (PageTurner) {

		var element = $compile(baseTmpl)($rootScope);
		$rootScope.$digest();

		expect(PageTurner.getPageId()).toEqual(0);

	}));


	it('Get number of pages', inject(function (PageTurner) {

		var element = $compile(baseTmpl)($rootScope);
		$rootScope.$digest();

		var num = PageTurner.getNumOfPages();
		expect(num).toEqual(1);

	}));


	it('Get number of pages in page added', inject(function (PageTurner) {

		var element = $compile(baseTmpl)($rootScope);
		$rootScope.$digest();

		PageTurner.addPage({
			template: next_page_tmpl,
			classNames: 'test-page'
		});

		var num = PageTurner.getNumOfPages();
		expect(num).toEqual(2);

	}));


	it('Open specified page', inject(function (PageTurner) {

		var element = $compile(baseTmpl)($rootScope);
		$rootScope.$digest();

		PageTurner.addPage({
			template: next_page_tmpl,
			classNames: 'test-page'
		});

		PageTurner.openPage(1);

		var page_elem = element[0].querySelectorAll('.active-page');
		expect(page_elem[0].outerHTML).toMatch(/Second page/);

	}));


	it('Open specified (invalid) page', inject(function (PageTurner) {

		var element = $compile(baseTmpl)($rootScope);
		$rootScope.$digest();

		PageTurner.openPage(1);

		// It should be opened still the first page
		var page_elem = element[0].querySelectorAll('.active-page');
		expect(page_elem[0].outerHTML).toMatch(/First page/);

	}));


	it('Open previous page', inject(function (PageTurner) {

		var element = $compile(baseTmpl)($rootScope);
		$rootScope.$digest();

		PageTurner.addPage({
			template: next_page_tmpl,
			classNames: 'test-page'
		});

		PageTurner.openPrevPage();

		var page_elem = element[0].querySelectorAll('.active-page');
		expect(page_elem[0].outerHTML).toMatch(/First page/);

	}));


	it('Open next page', inject(function (PageTurner) {

		var element = $compile(baseTmpl)($rootScope);
		$rootScope.$digest();

		PageTurner.addPage({
			template: next_page_tmpl,
			classNames: 'test-page'
		});

		PageTurner.openNextPage();

		var page_elem = element[0].querySelectorAll('.active-page');
		expect(page_elem[0].outerHTML).toMatch(/Second page/);

	}));


	it('Open next & previous page', inject(function (PageTurner) {

		var element = $compile(baseTmpl)($rootScope);
		$rootScope.$digest();

		PageTurner.addPage({
			template: next_page_tmpl,
			classNames: 'test-page'
		});

		PageTurner.openNextPage();
		PageTurner.openPrevPage();

		var page_elem = element[0].querySelectorAll('.active-page');
		expect(page_elem[0].outerHTML).toMatch(/First page/);

	}));


});
