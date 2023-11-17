$(document).ready(function () {
  // Item browse and search
  if ($('body').hasClass('resource browse') || $('body').hasClass('resource search')) {
    // Infinite scroll/load more
    // check if results have more than one page
    if ($('.pagination .next').length) {
      var status = $(`
        <div class="page-load-status">
          <div class="row justify-content-center pb-5 mb-5">
            <div class="col-auto">
              <div class="spinner-border infinite-scroll-request" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </div>
        `);
      status.hide();
      var loadButton = `
      <div class="row justify-content-center">
        <div class="col-auto">
          <button id="load-button" class="btn btn-fit-green floating-action" type="button" aria-controls="searchFilters" aria-label="Load more results">
            <span class="action-container">
              <i class="fas fa-plus" aria-hidden="true" title="Load more results">
              </i>
              Load More
            </span>
          </button>
        </div>
      </div>
      `;
      $('.pagination-row').after(loadButton).after(status);
      $('#browse-container').attr('aria-live', 'polite')
      let nextURL;
      let appendElement = '.item-container';
      let currentItemCount;

      function updateNextURL(doc) {
        if ($(doc).find('.next').length) {
          nextURL = $(doc).find('.next').attr('href');
          if (!nextURL.includes('&scroll_request=true')) {
            nextURL = nextURL + '&scroll_request=true';
          }
        } else {
          nextURL = null;
        }
      }

      function getLinkData(doc) {
        if ($(doc).find('script[type="application/ld+json"]').length) {
          var newLinkData = $(doc).find('script[type="application/ld+json"]');
          $('script[type="application/ld+json"]').last().after(newLinkData);
        }
      }

      function updateFocus() {
        var firstLoadedElement = $(appendElement)[currentItemCount];
        $(firstLoadedElement).find('a.card-img').focus();
        getItemCount();
      }

      function getItemCount() {
        currentItemCount = $(appendElement).length
      }
      // get initial nextURL
      updateNextURL(document);
      getItemCount();
      let $container = $('#browse-container').infiniteScroll({
        // options
        // use function to set custom URLs
        path: function () {
          return nextURL;
        },
        checkLastPage: '.next',
        append: appendElement,
        scrollThreshold: false,
        button: '#load-button',
        hideNav: '.pagination-row',
        status: '.page-load-status',
        history: false,
      });
      // update nextURL on page load
      $container.on('load.infiniteScroll', function (event, body, path, response) {
        history.replaceState(null, null, path.replace('&scroll_request=true', ''));
        updateNextURL(body);
        getLinkData(body);
      });
      $container.on('append.infiniteScroll', function () {
        updateFocus();
      });
    }
  }
  //Media viewer
  if ($('body').hasClass('show')) {
    //clipboard
    $('.clip-button').each(function (index) {
      new ClipboardJS(this);
    });
    $("#text-download").on("click.fashionCalendar", function (event) {
      event.preventDefault();
      saveAs($(this).attr("href"), $(this).data("id") + ".txt");
    });
    // $("#pdf-download").on("click.fashionCalendar", function (event) {
    //   event.preventDefault();
    //   $("iframe.pdfobject").contents().find("#download").click();
    // });
    let title = $("#quick-details .title").text();
    $(".pdf-container iframe").attr("title", title);
  }
});