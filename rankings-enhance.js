var _old_authors = null;
var _old_computeStats = null;

function reset_state(rank = true)
{
    if (_old_computeStats !== null)
    {
        CSRankings.theInstance.computeStats = _old_computeStats;
        _old_computeStats = null;
    }
    if (_old_authors !== null)
    {
        CSRankings.theInstance.authors = _old_authors;
        _old_authors = null;
        if (rank)
        {
            CSRankings.theInstance.rank();
        }
    }
}

// Change it so that it's authors instead of institutions
function only_authors(all_pubs_worth_one = false)
{
    _old_authors = CSRankings.theInstance.authors;

    // Hack to make csrankings to have the Count that shows up to just be the sum of counts,
    // rather than geometic mean
    _old_computeStats = CSRankings.theInstance.computeStats;
    CSRankings.theInstance.computeStats = function (deptNames, numAreas, weights) {
        CSRankings.theInstance.stats = {};
        for (const dept in deptNames) {
            if (!deptNames.hasOwnProperty(dept)) {
                continue;
            }
            CSRankings.theInstance.stats[dept] = 0;
            for (const area in CSRankings.topLevelAreas) {
                const areaDept = area + dept;
                if (!(areaDept in CSRankings.theInstance.areaDeptAdjustedCount)) {
                    CSRankings.theInstance.areaDeptAdjustedCount[areaDept] = 0;
                }
                if (weights[area] != 0) {
                    // Adjusted (smoothed) geometric mean.
                    CSRankings.theInstance.stats[dept] += CSRankings.theInstance.areaDeptAdjustedCount[areaDept];
                }
            }
        }
    };

    CSRankings.theInstance.authors = _old_authors.map(function (author)
        {
            var new_author = Object.assign({}, author);
            new_author.dept = new_author.name;
            if (all_pubs_worth_one)
            {
                new_author.adjustedcount = new_author.count;
            }
            return new_author;
        });
}


var actions = [
    {
        title: "All Authors (adj)",
        action: function () {
            reset_state(false);
            only_authors(false);
            CSRankings.theInstance.rank();
            return false;
        }
    },
    {
        title: "All Authors (raw)",
        action: function () {
            reset_state(false);
            only_authors(true);
            CSRankings.theInstance.rank();
            return false;
        }
    },
    {
        title: "Reset",
        action: function () {
            reset_state(true);
            return false;
        }
    }
];

// When we first run, we'll add buttons to do what we want
var page_header = document.getElementsByClassName('page-header')[0];

actions.forEach(action =>
    {
        var btn = document.createElement("button");
        btn.innerHTML = action.title;
        btn.onclick = action.action;
        page_header.prepend(btn);
    });
