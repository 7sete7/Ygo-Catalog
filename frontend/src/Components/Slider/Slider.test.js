import React from 'react';
import { expect } from 'chai';
import Enzyme, { mount, shallow } from 'enzyme';
import Slider from './Slider';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

const SPY = (e) => {
  console.log(`Click em ${e.target}`);
}

describe("Slider", () => {
  it("should have 10 <img />'s tags", () => {
    let slider = mount(<Slider onImageClick={SPY}/>);

    expect(slider.find(<img/>)).to.have.lengthOf(10);
  });
})
