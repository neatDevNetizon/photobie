function unixToDateString(unix) {
  const date = new Date(unix);
  return (
    `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  );
}

export default unixToDateString;
