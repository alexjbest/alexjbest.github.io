(function () {
  'use strict';

  function getKnowlUrl(link) {
    return link.getAttribute('data-knowl') || link.getAttribute('href');
  }

  function getOutputElement(link) {
    var existingId = link.getAttribute('aria-controls');
    if (existingId) {
      return document.getElementById(existingId);
    }

    var output = document.createElement('div');
    var id = 'knowl-output-' + Math.random().toString(36).slice(2);
    output.id = id;
    output.className = 'knowl-output';
    output.setAttribute('role', 'region');
    link.setAttribute('aria-controls', id);
    link.setAttribute('aria-expanded', 'false');

    var container = link.closest('li') || link.parentNode;
    container.appendChild(output);
    return output;
  }

  function typesetMath(output) {
    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise([output]);
    }
  }

  function openKnowl(link, output) {
    output.classList.add('is-open');
    link.setAttribute('aria-expanded', 'true');
    typesetMath(output);
  }

  function closeKnowl(link, output) {
    output.classList.remove('is-open');
    link.setAttribute('aria-expanded', 'false');
  }

  function loadKnowl(link, output) {
    var url = getKnowlUrl(link);
    output.innerHTML = '<p>Loading abstract…</p>';
    openKnowl(link, output);

    return fetch(url, { credentials: 'same-origin' })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Could not load ' + url + ' (' + response.status + ')');
        }
        return response.text();
      })
      .then(function (html) {
        output.innerHTML = html;
        output.setAttribute('data-loaded', 'true');
        typesetMath(output);
      })
      .catch(function () {
        output.innerHTML = '<p class="knowl-error">Sorry, this abstract could not be loaded. Try opening it directly: <a href="' + url + '">' + url + '</a>.</p>';
      });
  }

  function toggleKnowl(event) {
    var link = event.target.closest('a[data-knowl]');
    if (!link) {
      return;
    }

    event.preventDefault();
    var output = getOutputElement(link);

    if (output.classList.contains('is-open')) {
      closeKnowl(link, output);
      return;
    }

    if (output.getAttribute('data-loaded') === 'true') {
      openKnowl(link, output);
      return;
    }

    loadKnowl(link, output);
  }

  document.addEventListener('click', toggleKnowl);
}());
