module.exports.log = (...data) => {
  console.log(Date.now(), ...data);

  
};

module.exports.logln = (...data) => {
  console.log('\n');
  console.log(Date.now(), ...data);

  
};
