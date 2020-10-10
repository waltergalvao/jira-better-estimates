let isHidingEstimates = false;
const observer = new MutationObserver(addClassToBadgesInsideIssueDetails);
let menu;
let detailView;

function injectWhenLoaded() {
    // @TODO Figure out a better way to detect the page has fully loaded
    setTimeout(function () {
        menu = document.getElementById("ghx-modes-tools");
        detailView = document.getElementById('ghx-detail-view');

        if (menu === null || detailView === null) {
            injectWhenLoaded();
            return;
        }

        addButton();
        observe();
    }, 1000);
}

function observe(startObserving = true) {
    if (startObserving === false) {
        observer.disconnect();
        return false;
    }

    observer.observe(detailView, {
        childList: true,
        attributes: true,
        subtree: true,
    });
}

function addClassToBadgesInsideIssueDetails() {
    let detailedEstimateBadge = Array
        .from(document.querySelectorAll('div[data-test-id="issue.views.issue-base.context.context-items.primary-items"] span'))
        .find(el => el.textContent.match(/[+-]?([0-9]*[.])?[0-9]+/) && !isNaN(el.textContent));

    if (detailedEstimateBadge) {
        observe(false);
        detailedEstimateBadge.classList.add('jhe-hide-color');
        observe();
    }
}

function addButton() {
    let newOption = document.createElement('button');
    newOption.classList.add('jhe-button');
    newOption.innerText = "Toggle Estimates";

    newOption.addEventListener('click', function () {
        isHidingEstimates = !isHidingEstimates;

        if (isHidingEstimates) {
            document.body.classList.add('jhe-hide');
            return;
        }

        document.body.classList.remove('jhe-hide');
    });

    newOption.addEventListener('mouseover', function () {
        newOption.classList.add('active');
    });

    newOption.addEventListener('mouseout', function () {
        newOption.classList.remove('active');
    });

    menu.prepend(newOption);
}

injectWhenLoaded();
