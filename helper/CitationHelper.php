<?php

namespace OmekaTheme\Helper;

use Laminas\View\Helper\AbstractHelper;
use Omeka\Api\Representation\ItemRepresentation;

class CitationHelper extends AbstractHelper
{
  public function __invoke(ItemRepresentation $item)
  {
    $escape = $this->getView()->plugin('escapeHtml');
    $title = $item->displayTitle();
    $url = $escape($item->url());
    $chicago = 'Finley, Ruth. "' . $title . '". Fashion Calendar Research Database. <a href="' . $url . '">' . $url . '</a>. Courtesy of the Fashion Institute of Technology-SUNY, Gladys Marcus Library unit of Special Collections and FIT Archive under <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>.';
    return '
        <div id="citation" class="input-group my-3">
          <div class="form-control font-monospace text-break bg-white" id="chicagoCitation">
          ' . str_replace('..', '.', $chicago) . '
          </div>
          <button class="btn btn-dark clip-button" type="button" id="chicago-button" data-clipboard-target="#chicagoCitation" aria-label="Copy citation to clipboard">
            <i class="fas fa-copy" title="Copy citation to clipboard" aria-hidden="true"></i>
          </button>
        </div>
        ';
  }
  // Converts $title to Title Case, and returns the result.
  protected function titleCase($title)
  {
    $smallwordsarray = array(
      'of',
      'a',
      'the',
      'and',
      'an',
      'or',
      'nor',
      'but',
      'is',
      'if',
      'then',
      'else',
      'when',
      'at',
      'from',
      'by',
      'on',
      'off',
      'for',
      'in',
      'out',
      'over',
      'to',
      'into',
      'with'
    );

    // Split the string into separate words
    $words = explode(' ', $title);

    foreach ($words as $key => $word) {
      // If this word is the first, or it's not one of our small words, capitalise it
      // with ucwords().
      if ($key == 0 or !in_array($word, $smallwordsarray)) {
        $words[$key] = ucwords($word);
      }
    }

    // Join the words back into a string
    $newtitle = implode(' ', $words);

    return $newtitle;
  }
}
