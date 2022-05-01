import React from 'react';
import { Button } from 'react-bootstrap';
import ImageUploading from 'react-images-uploading';
import axiosUtil from './utils/axiosUtil';

/// code reference from
/// https://codesandbox.io/s/react-images-uploading-demo-u0khz

// let onUploadToServer;

export default function ImageUploader(messages) {
  const [images, setImages] = React.useState([]);
  const maxNumber = 69;
//   onUploadToServer = onUploadGiven;
 
  const onChange = (imageList, addUpdateIndex) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };


  const onUploadToServer = async (image, messages) => {
    const theMessages = [messages.messages[0]];
    const theSetMessages = messages.setMessages;
    const beforeMsg = "Saving the image into the web3 space";
    theSetMessages([...theMessages, beforeMsg])
    const res = await axiosUtil.postImage('/api/uploadImage', {"image": image})
    console.log(res, messages)
    const msg = `The uploading is completed, please check the url: https://${res.data.cid}.ipfs.nftstorage.link`;
    theSetMessages([...theMessages, beforeMsg, msg])
  }

 
  return (
    <ImageUploading
    // multiple
    value={images}
    onChange={onChange}
    maxNumber={maxNumber}
    dataURLKey="data_url"
    >
    {({
        imageList,
        onImageUpload,
        onImageRemoveAll,
        onImageUpdate,
        onImageRemove,
        isDragging,
        dragProps,
    }) => {
        return (
        // write your building UI
    <div className="upload__image-wrapper">
        <div className="d-inline-flex p-2 bd-highlight">
            <Button variant="alert alert-success"
                style={isDragging ? { color: 'red' } : undefined}
                onClick={onImageUpload}
                {...dragProps}>
                Click or Drop here
            </Button>
        </div>

        <div className="d-flex flex-column bd-highlight mb-3">
            <div key={0} className="image-itemp-2 bd-highlight">
                <div className="d-flex justify-content-center">
                    <div className="col-sm-12 col-md-8 col-lg-6">
                        {imageList.map((image) => (
                            <>
                            <img src={image['data_url']} alt="" style={{width : "100%", objectFit: "contain"}}/>
                            {/* <ImageCropper image={image['data_url']}></ImageCropper> */}
                            <Button variant="alert alert-success" onClick={() => onImageUpdate(0)}>Update</Button>
                            &nbsp;
                            <Button variant="alert alert-success" onClick={() => onImageRemove(0)}>Remove</Button>
                            &nbsp;
                            <Button variant="alert alert-success" onClick={() => onUploadToServer(image['data_url'], messages)}>mint</Button>
                            </>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
    )}}
    </ImageUploading>
  );
}