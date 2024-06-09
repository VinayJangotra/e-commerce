import { ChangeEvent ,useState} from "react";
import { BiArrowBack } from "react-icons/bi";


const Shipping = () => {
    const [shippingInfo, setShippingInfo]=useState({
    address: "",
    city: "",
    state:"",
    country:"",
    pinCode:""
    })
    const changeHandler=(e:ChangeEvent<HTMLInputElement | HTMLSelectElement>)=>{
        setShippingInfo((prev)=>({...prev,[e.target.name]:e.target.value}))
    };
  return (
    <div className="shipping">
      <button className="return">
        <BiArrowBack />
      </button>
      <form>
        <h3>Shipping Form</h3>
        <input
          required
          type="text"
          placeholder="Address"
          name="address"
          value={shippingInfo.address}
          onChange={changeHandler}
        />
        <br />
        <input
          required
          type="text"
          placeholder="City"
          name="city"
          value={shippingInfo.city}
          onChange={changeHandler}
        />
        <br />
        <input
          required
          type="text"
          placeholder="State"
          name="state"
          value={shippingInfo.state}
          onChange={changeHandler}
        />
        <br />
        <select
            required
            name="country"
            value={shippingInfo.country}
            onChange={changeHandler}
        >
            <option value="">Select Country</option>
            <option value="India">India</option>
            <option value="USA">USA</option>
            <option value="UK">UK</option>
            <option value="Australia">Australia</option>
        </select>

        <br />
        <input
          required
          type="number"
          placeholder="Pin Code"
          name="pinCode"
          value={shippingInfo.pinCode}
          onChange={changeHandler}
        />
        <br />
        <button className="pay-now" type="submit">
            Pay Now
        </button>
      </form>
    </div>
  );
}

export default Shipping
