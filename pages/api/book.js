var fs = require('fs');

export default function handler(req, res) {
  const address = req.query.address;
  try {
    fs.readFile('data.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      const obj = JSON.parse(data);
      if (Object.keys(obj).length === 1000) {
        res.status(200).json({
          success: true,
          isThere: false,
          max: true,
          message: 'already there',
        });
      } else if (obj[`${address}`]) {
        res.status(200).json({
          success: true,
          isThere: true,
          max: false,
          message: 'already there',
        });
      } else {
        const body = JSON.parse(req.body);
        const newObj = { ...obj, [address]: { ...body } };
        fs.writeFile('data.json', JSON.stringify(newObj), function (err) {
          if (err) {
            console.log(err);
          }
          res.status(200).json({
            success: true,
            isThere: false,
            max: false,
            message: 'added',
            [address]: address,
          });
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
}
