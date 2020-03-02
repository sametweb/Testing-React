import axios from "axios";
import React from "react";
import * as rtl from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import App from "./App";

jest.mock("axios", () => {
  return {
    get: jest.fn(() =>
      Promise.resolve({
        data: {
          results: [
            { name: "Some Star Wars Char", url: 1 },
            { name: "Another Star Wars Char", url: 2 }
          ]
        }
      })
    )
  };
});

afterEach(rtl.cleanup);

describe("API calls", () => {
  it("makes API call", async () => {
    const wrapper = rtl.render(<App />);
    await wrapper.findAllByTitle(/character/i);
    expect(axios.get).toHaveBeenCalled();
  });
});

describe("The DOM", () => {
  it("renders the logo", async () => {
    const wrapper = rtl.render(<App />);
    await wrapper.findAllByTitle(/character/i);
    const element = wrapper.getByAltText(/logo/i);
    expect(element).toBeVisible();
  });

  it("renders prev/next buttons", async () => {
    const wrapper = rtl.render(<App />);
    await wrapper.findAllByTitle(/character/i);
    const prev = wrapper.getByTestId("prev");
    const next = wrapper.getByTestId("next");
    expect(prev).toBeVisible();
    expect(next).toBeVisible();
  });
});

describe("Pagination buttons", () => {
  it("move between pages correctly", async () => {
    const wrapper = rtl.render(<App />);
    await wrapper.findAllByTitle(/character/i);
    const next = wrapper.getByText(/next/i);
    const prev = wrapper.getByText(/previous/i);

    rtl.act(() => {
      rtl.fireEvent.click(next);
    });

    expect(wrapper.queryAllByTitle(/character/i)).not.toBeNull();
    expect(wrapper.queryAllByTitle(/character/i)).not.toBe(
      wrapper.queryAllByTitle(/character/i)
    );

    rtl.act(() => {
      rtl.fireEvent.click(prev);
    });

    expect(wrapper.queryAllByTitle(/character/i)).not.toBeNull();
    expect(wrapper.queryAllByTitle(/character/i)).not.toBe(
      wrapper.queryAllByTitle(/character/i)
    );
  });
});
