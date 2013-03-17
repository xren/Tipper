define(['tipper', 'chai'], function(module) {
	'use strict';
	var Model = module.Model,
		InputScreen = module.InputScreen;

	describe('Model', function() {
		var model = new Model();

		describe('Mode change test', function() {
			it('should handle incorrect mode save', function() {
				expect(function() {model.changeMode('test')}).to.throw('Incorrect mode');
			});

			it('should change mode to total correctly', function() {
				model.changeMode('total');
				expect(model.get('mode')).to.equal('total');
			});

			it('should change mode to each correctly', function() {
				model.changeMode('each');
				expect(model.get('mode')).to.equal('each');
			});
		})

		describe('Default value test', function() {
			it('should have correct default value', function() {
				expect(model.get('bill')).to.equal('0');
				expect(model.get('total')).to.equal('0');
				expect(model.get('eachTotal')).to.equal('0');
				expect(model.get('eachTip')).to.equal('0');
				expect(model.get('tipTotal')).to.equal('0');
				expect(model.get('percentage')).to.equal('18');
				expect(model.get('splits')).to.equal('1');
			});
		});

		describe('Calculate total test', function() {
			it('should compute the correct total amount', function() {
				expect(model.calcTotal(35, 18)).to.equal('41.30');
			});

			it('should handle NaN bill amount error', function() {
				expect(function() {model.calcTotal('38', 18)}).to.throw("NaN Error");
			});

			it('should handle NaN percentage error', function() {
				expect(function() {model.calcTotal(38, '28')}).to.throw('NaN Error');
			});

			it('should handle NaInt percentage error', function() {
				expect(function() {model.calcTotal(38, 28.3)}).to.throw('NaN Error');
			});

			it('should handle negative bill value error', function() {
				expect(function() {model.calcTotal(-2, 15)}).to.throw('Incorrect bill');
			});

			it('should handle negative percentage value error', function() {
				expect(function() {model.calcTotal(25, -15)}).to.throw('Incorrect percentage');
			});

		});

		describe('Calculate tipTotal test', function() {
			it('should compute the correct tip total amount', function() {
				expect(model.calcTipTotal(35.7, 43.2)).to.equal('7.50');
			});

			it('should handle NaN bill amount error', function() {
				expect(function() {model.calcTipTotal('38', 42.5)}).to.throw("NaN Error");
			});

			it('should handle NaN total error', function() {
				expect(function() {model.calcTipTotal(38, '58.2')}).to.throw('NaN Error');
			});

			it('should handle negative bill value error', function() {
				expect(function() {model.calcTipTotal(-2.7, 15)}).to.throw('Incorrect bill');
			});

			it('should handle negative total value error', function() {
				expect(function() {model.calcTipTotal(25, -45.5)}).to.throw('Incorrect total');
			});

			it('should handle bill less than total error', function() {
				expect(function() {model.calcTipTotal(25, 15.5)}).to.throw('Incorrect value. Bill greater than total');
			})
		});

		describe('Calculate eachTotal test', function() {
			it('should compute the correct each total amount', function() {
				expect(model.calcEachTotal(35.72, 5)).to.equal('7.14');
			});

			it('should handle NaN bill amount error', function() {
				expect(function() {model.calcEachTotal('38', 3)}).to.throw("NaN Error");
			});

			it('should handle NaN total error', function() {
				expect(function() {model.calcEachTotal(38, '58')}).to.throw('NaN Error');
			});

			it('should handle NaInt total error', function() {
				expect(function() {model.calcEachTotal(38, 2.3)}).to.throw('NaN Error');
			});

			it('should handle negative total value error', function() {
				expect(function() {model.calcEachTotal(-2.7, 15)}).to.throw('Incorrect total');
			});

			it('should handle less than 1 splits value error', function() {
				expect(function() {model.calcEachTotal(25, 0)}).to.throw('Incorrect splits');
			});
		});

		describe('Calculate eachTip test', function() {
			it('should compute the correct each tip amount', function() {
				expect(model.calcEachTip(35.72, 5)).to.equal('7.14');
			});

			it('should handle NaN tip total amount error', function() {
				expect(function() {model.calcEachTip('38', 3)}).to.throw("NaN Error");
			});

			it('should handle NaN splits error', function() {
				expect(function() {model.calcEachTip(38, '58')}).to.throw('NaN Error');
			});

			it('should handle NaInt splits error', function() {
				expect(function() {model.calcEachTip(38, 2.3)}).to.throw('NaN Error');
			});

			it('should handle negative tip total value error', function() {
				expect(function() {model.calcEachTip(-2.7, 15)}).to.throw('Incorrect tipTotal');
			});

			it('should handle less than 1 splits value error', function() {
				expect(function() {model.calcEachTip(25, 0)}).to.throw('Incorrect splits');
			});
		});

		describe('Change bill test', function() {
			it('should compute handle NaN bill amount', function() {
				expect(function() {model.changeBill('test');}).to.throw('Incorrect bill');
			});

			it('should compute the correct result', function() {
				model.changeBill(45);
				expect(model.get('bill')).to.equal('45');
				expect(model.get('total')).to.equal('53.10');
				expect(model.get('tipTotal')).to.equal('8.10');
			});
		});

		describe('Change percentage test', function() {
			it('should compute handle NaN percentage amount', function() {
				expect(function() {model.changePercentage('test');}).to.throw('Incorrect percentage');
			});

			it('should compute handle NaInt percentage amount', function() {
				expect(function() {model.changePercentage(12.2);}).to.throw('Incorrect percentage');
			});

			it('should compute the correct result', function() {
				model.changeBill(45);
				model.changePercentage(15);
				expect(model.get('bill')).to.equal('45');
				expect(model.get('total')).to.equal('51.75');
				expect(model.get('tipTotal')).to.equal('6.75');
				expect(model.get('percentage')).to.equal('15');
			});
		});

		describe('Change splits test', function() {
			it('should compute handle NaN splits amount', function() {
				expect(function() {model.changeSplits('test');}).to.throw('Incorrect splits');
			});

			it('should compute handle NaInt splits amount', function() {
				expect(function() {model.changeSplits(12.2);}).to.throw('Incorrect splits');
			});

			it('should compute the correct result', function() {
				model.changeBill(45);
				model.changePercentage(15);
				model.changeSplits(3);
				expect(model.get('bill')).to.equal('45');
				expect(model.get('total')).to.equal('51.75');
				expect(model.get('tipTotal')).to.equal('6.75');
				expect(model.get('percentage')).to.equal('15');
				expect(model.get('eachTotal')).to.equal('17.25');
				expect(model.get('eachTip')).to.equal('2.25');
				expect(model.get('splits')).to.equal('3');
			});
		});



	});
});