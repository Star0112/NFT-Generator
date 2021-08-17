## NFT Image Generator

1. Add trait info in [traits.json] file.
   Trait info includes correct name of trait type and value, and the count of specific trait.
   The order of traits should start from background layer trait.
2. Save trait images in [traits] folder.
   Every trait has one directory including trait images. Here directory name and file name should be exactly same as what is defined in [traits.json].
3. Edit image extension and count of images to be generated in [image-gen.js] file.
   const extension = 'png';
   const imgCount = 191;
4. Run script.
   node image-gen.js
   Generated images saved in [images] directory.
