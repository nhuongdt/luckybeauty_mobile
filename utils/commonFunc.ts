class CommonFunc {
  checkNull = (input: any) => {
    return (
      input === "null" ||
      input === null ||
      input === undefined ||
      input === "undefined" ||
      input.toString().replace(/\s+/g, "") === ""
    );
  };
  checkNull_orEmpty = (input: any) => {
    return (
      input === "null" ||
      input === null ||
      input === undefined ||
      input === "undefined" ||
      input === "00000000-0000-0000-0000-000000000000" ||
      input.toString().replace(/\s+/g, "") === ""
    );
  };
}

export default new CommonFunc();
