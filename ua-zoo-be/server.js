const express = require('express');
const app = express();
const upload = require('./uploadMiddleware');

// Import the NFTStorage class and File constructor from the 'nft.storage' package
const { NFTStorage, Blob } = require('nft.storage');

// Paste your NFT.Storage API key into the quotes:
const NFT_STORAGE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEQwNzBmQmZhQkYxQ0MzNDlhNTRBNWJBMmUwZmYzYzQ4NGVlQzg5ZDgiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1MTIzNjk5NjY3MiwibmFtZSI6ImtseXZlLXVhLXpvbyJ9.Zuh-2aYg1oB8nknuk-XwToldG8kmX7YAId5oU89q7E8'
const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY })
 
app.post('/uploadImage', upload.single('image'), async function (req, res) {
    await console.log('post');
    if (!req.file && !req.body.image) {
      res.status(401).json({error: 'Please provide an image'});
    }
    // console.log(req)
    let binary = null;
    if (req.file) {
      binary = req.file.buffer
    } else {
      binary = Buffer.from(req.body.image.replace(/data:.*;base64,/,''), 'base64')
    }
    console.debug(binary)
    const cid = await  nftstorage.storeBlob(new Blob([binary],  {type : "image/jpeg"}))
    return res.status(200).json({ cid: cid });
});
  

var server = app.listen(8083, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Application start, location: http://%s:%s", host, port)
})