window.options = {}

$(->
    window.choice = new options.ChoiceList $('ul')
)

get_random_float_between = (min, max) ->
    return Math.random() * (max - min) + min

get_random_int_between = (min, max) ->
    return Math.round get_random_float_between min, max

class options.ChoiceList
    constructor: (@node) ->
        @width = @node.width()
        @height = @node.height()
        @choices = []
        @create_options()
        @place_options()
        @move()

    create_options: ->
        @node.children("li").each((_, node) =>
            @choices.push new options.Choice $(node), @
        )

    place_options: ->
        for choice in @choices
            choice.place_randomly()

    move: ->
        for choice in @choices
            choice.move()

class options.Choice
    constructor: (@node, @choice_list) ->
        @width = @node.outerWidth true
        @height = @node.outerHeight true
        @x = 0
        @y = 0
        @vel = 5
        @set_random_direction()
        # We should explicity set width since these are floats
        @node.css(
            width   : @node.width()
            height  : @node.height()
        )

    move: ->
        @should_be_moving = true

        do_movement = =>
            x = @x + @vector_x
            y = @y + @vector_y
            if @is_valid_location x, y
                @place_at x, y
            else
                @set_random_direction()
                do_movement()
            return

        @movement_interval = setInterval =>
            if @should_be_moving
                do_movement()
            else
                clearInterval @movement_interval
        , 50


    stop_moving: ->
        @should_be_moving = false

    set_random_direction: ->
        # Get x and y vectors, make sure with abs vals combined, we have a total vector of @vel
        @vector_x = get_random_float_between -@vel, @vel
        @vector_y = if (Math.random() > 0.5) then (@vel - Math.abs(@vector_x)) else -(@vel - Math.abs(@vector_x))

    is_valid_location: (x, y) ->
        return false if x < 0 or x > @choice_list.width - @width
        return false if y < 0 or y > @choice_list.height - @height
        return false if @check_for_collision x, y
        return true

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
            x = get_random_int_between 0, (@choice_list.width - @width)
            y = get_random_int_between 0, (@choice_list.height - @height)
            if !@check_for_collision x, y
                @place_at x, y
                is_placed = true
        count = 100
        while !is_placed
            try_to_place()
            count--
            break if count is 0

        return
