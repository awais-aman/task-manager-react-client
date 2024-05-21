import React from "react";

import { styles } from "assets/styles";

const NotFound = () => {
  const classes = styles();

  return (
    <div className={classes.notFoundContainer}>
      <h1 className={classes.notFoundTitle}>404 - Page Not Found</h1>
      <p className={classes.notFoundMessage}>
        The page you are looking for does not exist.
      </p>
    </div>
  );
};

export default NotFound;
