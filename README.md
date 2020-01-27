# Photo App

## Setting up and running the application on local

After cloning the application, go to the folder,

1. Run `npm install` to install all the dependencies.
2. Run `npm run start` to start the application in local.

## Thought process:

I decided to go with firebase for backend, since our backend requirements are pretty straight forward, and firebase could accomodate pretty much everything we need.

### Image Uploader

Since I am using firebase, I had to think around accomadating it in the design.

I broke down the image upload process into three parts:

#### Uploading the image

When a user uploads an image(s), the actual image gets uploaded to firebase cloudstorage. Also, at the time of upload, I am creating an object with the respective image's information (id,url,name, and timestamp), and storing it to a firebase db. We need to do this step since the only way to fetch images from firebase storage is through URLs.

#### Resizing the image to create a thumbnail

Since we need to show an image grid on the home page, and we can't afford to load the full size images on home page,I am resizing the image to a thumbnail using canvas at the time of upload.

#### Uploading the thumbnail

I am creating another object with the thumbnail information. For the thumbnail's name, I am appending "thumbnail\_" to the image name. This helps with mapping every thumbnail to its full size image counterpart on the view.

I am using react-dropzone to implement the drag and drop upload functionality. I wanted to use the native drag and drop feature of html5 to accomplish this, but due to time constraints, I decided to go with react-dropzone.

### Image Display Grid

At page load, I am fetching the URLs of the thumbnails, and displaying those in the grid.
Once I have all the thumbnails information in the app's state, I am creating an object, with the thumbnail's info, and adding the respective thumbnail's full size image's url in the object.
This helps with passing the respective image's url as a data-attribute to the thumbnail.
I am passing this data-attribute to the full-image view component

### Full Image view.

For the full image view (FullImageCarousel component), I am simulating a carousel, by passing the urls of the images in the adjascent indexes ( I have all the images' information in the app's state) to the next and previous buttons, and rendering those images on click of the buttons.
For the transition effect, I am just resetting the opacity of the images onload.

I realise this is very hacky, but I had an especially hectic week at work and was really pressed for time.

One major design flaw that I noticed yesterday in the Image Carousel view, is that I am passing the current image's url through the app's store.
I shouldn't have done it that way. Instead, I should have passed the url through the router. That ways, there would be a route for every image, and on page upload, the image would still be present.
Again, I realize that it's a pretty major bug, and the only reason I wasnt able to fix it, is because I noticed it last night,and it would require a lot of code change, and I have demos every day this week, so I probably wouldnt have been able to complete it all week ( I promised to submit this today i.e Wednesday)
