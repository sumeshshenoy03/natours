/*eslint-disable*/
import axios from 'axios';
import { showAlert } from './alert';
const stripe = Stripe(
  'pk_test_51KFHlPJzJpFLVCVsX5NOymjfSv6nMSc0sDZYpqe8ly4oOB3h0rKvgfrLly24tfePeG9WdbVF7ld247DgFaN2HAD60039YtuupS'
);

export const bookTour = async (tourId) => {
  try {
    //1) get checkout session from API

    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    console.log(session);

    //2) Create checkout form +change credit card

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
