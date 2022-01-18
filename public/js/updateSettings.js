import axios from 'axios';
import { showAlert } from './alert';

//updateData

//type is either password or data
export const updateSettings = async (data, type) => {
  const uri = type === 'data' ? 'updateMe' : 'updatePassword';
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/${uri}`,
      data,
    });
    if (res.data.status == 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully`);
    }
  } catch (err) {
    showAlert('error', err);
  }
};
