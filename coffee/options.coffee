window.options = {}

$(->
    window.choice = new options.ChoiceList $('ul')
)

get_random_between = (min, max) ->
    return Math.round Math.random() * (max - min) + min;

class options.ChoiceList
    constructor: (@node) ->
        @width = @node.width()
        @height = @node.height()
        @choices = []
        @create_options()
        @place_options()

    create_options: ->
        @node.children("li").each((_, node) =>
            @choices.push new options.Choice $(node), @
        )

    place_options: ->
        for choice in @choices
            choice.place_randomly()

class options.Choice
    constructor: (@node, @choice_list) ->
        @width = @node.outerWidth true
        @height = @node.outerHeight true
        @x = 0
        @y = 0

    check_for_collision: (x, y) ->
        a_left = x
        a_top = y
        a_right = x + @width
        a_bottom = y + @height
        for choice in @choice_list.choices
            continue if choice is @
            b_left = choice.x
            b_top = choice.y
            b_right = choice.x + choice.width
            b_bottom = choice.y + choice.height
            # If there is collision, return true
            if not (a_left > b_right or a_right < b_left or a_top > b_bottom or a_bottom < b_top)
                return true
        return false

    place_at: (x, y) ->
        @x = x
        @y = y
        @node.css(
            left    : x,
            top     : y
        )  

    place_randomly: ->
        is_placed = false

        try_to_place = =>
            x = get_random_between 0, (@choice_list.width - @width)
            y = get_random_between 0, (@choice_list.height - @height)
            if !@check_for_collision x, y
                @place_at x, y
                is_placed = true
        count = 100
        while !is_placed
            try_to_place()
            count--
            break if count is 0

        return
