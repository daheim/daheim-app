import {createAction} from 'redux-actions'
import api from '../api_client'

export const SWITCH_ROLE = 'profile/switchRole'
export const switchRole = createAction(SWITCH_ROLE, (role) => {
  return api.post('/role', {role})
})

export const LOAD = 'profile/load'
export const loadProfile = createAction(LOAD, () => {
  return api.get('/profile')
})

export const SAVE = 'profile.saveProfile'
export const saveProfile = (body) => {
  return {
    type: SAVE,
    meta: {
      api: {body}
    }
  }
}

export const SAW_RULES = 'profile/sawRules'
export const sawRules = createAction(SAW_RULES, () => {
  return api.post('/actions/users.sawRules', {})
})

// import dispatcher from '../dispatcher';
// import {Store} from 'flux/utils';
// import Promise from 'bluebird';

// import interop from '../interop';

// function readFile(file) {
//   let reader = new FileReader();
//   let result = new Promise(function(resolve, reject) {
//     reader.onload = e => resolve(e.target.result);
//     reader.onerror = e => reject(e.target.error);
//   });
//   reader.readAsDataURL(file);
//   return result;
// }

// function loadImage(content) {
//   let img = new Image();
//   let result = new Promise(function(resolve, reject) {
//     img.onload = e => resolve(e.target);
//     img.onerror = e => reject(e.target.error);
//   });
//   img.src = content;
//   return result;
// }

// export class ProfileStore extends Store {

//   profile = {};

//   getProfile() {
//     return this.profile;
//   }

//   getTempPicture() {
//     return this.tempPicture;
//   }

//   isUploading() {
//     return !!this.uploading;
//   }

//   __onDispatch(payload) {
//     switch (payload.type) {
//       case 'profile/reload': {
//         (async () => {
//           let profile = await $.ajax({
//             method: 'get',
//             url: '/users/profile',
//             contentType: 'application/json',
//             headers: {Authorization: interop.auth.authHeader()},
//           });
//           dispatcher.dispatch({type: 'profile/receive_raw', profile});
//         })();
//         break;
//       }

//       case 'profile/receive_raw': {
//         this.profile = payload.profile;
//         this.__emitChange();
//         break;
//       }

//       case 'profile/receive_temp_picture': {
//         this.tempPicture = payload.data;
//         this.__emitChange();
//         break;
//       }

//       case 'profile/upload_picture': {
//         if (this.uploading) { throw new Error('uploading already'); }
//         this.uploading = true;
//         this.__emitChange();

//         (async () => {
//           try {
//             let content = await readFile(payload.file);
//             let img = await loadImage(content);

//             let canvas = document.createElement('canvas');
//             canvas.width = canvas.height = 256;

//             let ratio = canvas.width / canvas.height;
//             let width = img.width;
//             let height = Math.floor(width / ratio);
//             if (height > img.height) {
//               height = img.height;
//               width = Math.floor(height * ratio);
//             }
//             let x = (img.width - width) / 2;
//             let y = (img.height - height) / 2;

//             let context = canvas.getContext('2d');
//             context.save();
//             context.drawImage(img, x, y, width, height, 0, 0, canvas.width, canvas.height);
//             context.restore();

//             let data = canvas.toDataURL('image/png');
//             dispatcher.dispatch({type: 'profile/receive_temp_picture', data});

//             let resultIgnored = await $.ajax({
//               method: 'post',
//               url: '/users/profile/picture',
//               data: JSON.stringify({data}),
//               contentType: 'application/json',
//               headers: {Authorization: interop.auth.authHeader()},
//             });
//           } catch (err) {
//             // TODO: handle error
//           }
//           dispatcher.dispatch({type: 'profile/receive_uploaded_picture'});
//         })();
//         break;
//       }

//       case 'profile/upload_picture_data': {
//         if (this.uploading) { throw new Error('uploading already'); }
//         this.uploading = true;
//         this.__emitChange();

//         let data = payload.data;
//         this.tempPicture = payload.data;
//         this.__emitChange();

//         (async () => {
//           try {
//             let resultIgnored = await $.ajax({
//               method: 'post',
//               url: '/users/profile/picture',
//               data: JSON.stringify({data}),
//               contentType: 'application/json',
//               headers: {Authorization: interop.auth.authHeader()},
//             });
//           } catch (err) {
//             // TODO: handle error
//           }
//           dispatcher.dispatch({type: 'profile/receive_uploaded_picture'});
//         })();
//         break;
//       }

//       case 'profile/receive_uploaded_picture': {
//         this.tempPicture = null;
//         this.uploading = false;
//         this.__emitChange();
//         break;
//       }
//     }
//   }
// }

// export default new ProfileStore(dispatcher);

// interop.once('ready', () => {
//   dispatcher.dispatch({type: 'profile/reload'});
// });

