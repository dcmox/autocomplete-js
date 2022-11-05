/**
 * Builds a trie based on an array of terms 
 *
 * @param {string[]} dict - Array of terms
 * @return {Trie}
 */
var buildTrie = function (dict) {
    // First sort our dictionary in order of: shortest -> longest
    dict.sort(function (a, b) { return a.length - b.length; });

    // Initial tri to empty object
    var trie = {};

    // Loop through dictionary and build tri
    for (var i = 0; i < dict.length; i++) {
        var word = dict[i];
        var path = trie;
        for (var j = 0; j < word.length; j++) {
            if (path[word[j]] === undefined) {
                path[word[j]] = {};
                // If we reach the end of a word, identify that the path is a valid word
                if (j === word.length - 1) {
                    path[word[j]].word = word;
                }
            }
            path = path[word[j]];
        }
    }
    return trie;
};

/**
 * Finds the closest terms based on a given sub-trie (or state)  
 *
 * @param {Trie} state - Trie or sub-tree
 * @param {boolean=true} strict - Set to false to return all sub-terms, true to only get n+1 length terms where n is current search length
 * @return {string[]}
 */
var closestWords = function (state, strict = true) {
    if (!state) {
        return undefined;
    }

    const findWordsFromKeys = (state) => {
        const words = [];
        const keys = Object.keys(state).filter((k) => k !== 'word'); 
        keys.forEach((k) => {
            if (state[k].word) {
                words.push(state[k].word);
            }
        })

        if (!words.length) {
            keys.forEach((k) => {
                const r = findWordsFromKeys(state[k]);
                words.push(...r.words);
            });
        }

        // Only find closest matches
        if (strict){
            let length = -1;
            return { words: words.sort((a, b) => a.length - b.length).reduce((a, c) => {
                if (length === -1 || length === c.length) {
                    length = c.length;
                    a.push(c);
                }
                return a;
            }, []) };
        }

        // Find all matches at current depth
        return { words: words.sort((a, b) => a.length - b.length) };
    }

    return findWordsFromKeys(state).words;
}
