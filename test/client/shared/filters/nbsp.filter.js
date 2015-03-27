describe('nbsp filter', function() {
  beforeEach(module('shared.filters'));
  var sut;

  beforeEach(inject(function(nbspFilter) {
    sut = nbspFilter;
  }));



  it('should return emptry string when undefined', function() {
    var result = sut(undefined);
    expect(result).to.equal('');
  });

  it('should convert two spaces into two &nbsp; values', function() {
    var result = sut('  ');
    expect(result).to.equal('&nbsp;&nbsp;');
  });

  it('should not convert a single space', function() {
    var result = sut(' ');
    expect(result).to.equal(' ');
  });

  it('should convert first paits of odd number of spaces', function() {
    var result = sut('     ');
    expect(result).to.equal('&nbsp;&nbsp;&nbsp;&nbsp; ');
  });

});