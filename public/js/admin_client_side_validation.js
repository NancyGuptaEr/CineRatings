$(document).ready(function () {
  const checkName = (param, paramName) => {
    if (!param.match(/^[a-z]{0,25}( [a-z]{0,25}){1,2}$/gi))
      throw `${paramName} must consist of letters and 2-3 spaces`;
    return param;
  };
  const checkDate = (date) => {
    if (
      !date.match(
        /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[0-1])\/[12][0-9]{3}$/gim
      )
    )
      throw `release date format is invalid`;
    const [month, day, year] = date.split("/");
    const formatDate = new Date(year, month - 1, day);
    if (
      !(
        formatDate.getFullYear() === +year &&
        formatDate.getMonth() + 1 === +month &&
        formatDate.getDate() === +day
      )
    )
      throw `${whatDate} is invalid`;
    return date;
  };

  $("#addMovieForm").on("submit", function (e) {
    let isValid = true;
    let errorMessage = "";
    try {
      if ($("#movieName").val().trim() === "")
        throw "movie tile is required<br>";
    } catch (error) {
      errorMessage += error;
      isValid = false;
    }

    try {
      checkName($("#director").val().trim(), "director");
    } catch (error) {
      errorMessage += "format of director is wrong.<br>";
      isValid = false;
    }

    try {
      const actorsInput = $("#actors").val().trim();
      if (actorsInput === "") throw "actors must exist";
      const actors = actorsInput.split(",")?.map((e) => {
        return checkName(e.trim(), e);
      });
    } catch (error) {
      errorMessage += "format of actors is wrong.<br>";
      isValid = false;
    }
    try {
      const writer = $("#writer").val().trim();
      if (writer !== "") checkName(writer, "writer");
    } catch (error) {
      errorMessage += "format of writer is wrong.<br>";
      isValid = false;
    }
    try {
      checkName($("#producer").val().trim(), "producer");
    } catch (error) {
      errorMessage += "format of producer is wrong.<br>";
      isValid = false;
    }
    try {
      checkDate($("#releaseDate").val().trim(), "Release Date");
    } catch (error) {
      errorMessage += "releaseDate is invalid.<br>";
      isValid = false;
    }

    if ($("#genre").val().length === 0) {
      errorMessage += "At least one genre should be selected.<br>";
      isValid = false;
    }

    if ($("#imageUpload").get(0).files.length === 0) {
      errorMessage += "Thumbnail image is required.<br>";
      isValid = false;
    }

    if (!isValid) {
      $("#error-message").html(errorMessage).show();
      e.preventDefault();
    } else {
      $("#error-message").hide();
    }
  });

  $("#updateMovieForm").on("submit", function (e) {
    let isValid = true;
    let errorMessage = "";

    try {
      if ($("#movieName").val().trim() === "") throw "Title is required.<br>";
    } catch (error) {
      errorMessage += error;
      isValid = false;
    }

    try {
      checkName($("#director").val().trim(), "director");
    } catch (error) {
      errorMessage += "format of director is wrong.<br>";
      isValid = false;
    }
    try {
      const actorsInput = $("#actors").val().trim();
      if (actorsInput === "") throw "actors must exist";
      const actors = actorsInput.split(",")?.map((e) => {
        return checkName(e.trim(), e);
      });
    } catch (error) {
      errorMessage += "format of actors is wrong.<br>";
      isValid = false;
    }
    try {
      const writer = $("#writer").val().trim();
      if (writer !== "") checkName(writer, "writer");
    } catch (error) {
      errorMessage += "format of writer is wrong.<br>";
      isValid = false;
    }
    try {
      checkName($("#producer").val().trim(), "producer");
    } catch (error) {
      errorMessage += "format of producer is wrong.<br>";
      isValid = false;
    }
    try {
      checkDate($("#releaseDate").val().trim(), "Release Date");
    } catch (error) {
      errorMessage += "releaseDate is invalid.<br>";
      isValid = false;
    }

    if ($("#genre").val().length === 0) {
      errorMessage += "At least one genre should be selected.<br>";
      isValid = false;
    }

    if ($("#imageUpload").get(0).files.length === 0) {
      errorMessage += "Thumbnail image is required.<br>";
      isValid = false;
    }

    if (!isValid) {
      $("#error-message").html(errorMessage).show();
      e.preventDefault();
    } else {
      $("#error-message").hide();
    }
  });
});

$(document).ready(function () {
  $(".delete-button").click(function (e) {
    e.preventDefault();
    const movieId = $(this).data("movieid");
    $.ajax({
      url: "/admin/" + movieId,
      type: "DELETE",
      success: function (result) {
        console.log("Movie deleted successfully");
        window.location.reload();
      },
      error: function (error) {
        console.error("Error deleting movie:", error);
      },
    });
  });
});

$(document).ready(function () {
  $(".deleteFlaggedReview-button").click(function (e) {
    e.preventDefault();
    const reviewId = $(this).data("reviewId");
    $.ajax({
      url: "/admin/flaggedReviews/" + reviewId,
      type: "DELETE",
      success: function (result) {
        console.log("Review deleted successfully");
        window.location.reload();
      },
      error: function (error) {
        console.error("Error deleting review:", error);
      },
    });
  });
});


