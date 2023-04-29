make fans of images similar to
https://www.thisiscolossal.com/2023/03/lyndi-sales-paper-sculptures/
by stepping through a palette of images like
https://www.northlandscapes.com/portfolio/iceland-basalt

create palette by taking 1px wide slice thru image and
step through each pixel color from top to bottom

could use algo as video mirror as well,
by isolating palette of each person and drawing fans of color
wherever they stand, with closeness to camera 
determining length of fan rays


(X) smooth particle palette colors (lerpColor)
(X) restore longevity scalar in emitter and
    implement palette prefill in a way that is compatible
( ) don't do background fade, or at least not as quickly;
    instead, set alpha of each particle mark to blend(?)
( ) vary longevity per particle instead of per emitter,
    based on distance to nearest emitter (fill space between emitters)
( ) mix two/three palettes in a single composition
( ) try adding dropshadows / lighting?
( ) choose background color based on selected palette