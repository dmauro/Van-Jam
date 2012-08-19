window.gui = {}

$(->
    window.heart_meter = new gui.HeartMeter()
    window.choice_list = new gui.ChoiceList 6
    choice_list.name_option 0, "Go home and be a family man."
    choice_list.name_option 1, "*Do a split*"
    choice_list.name_option 2, "*Flex muscles*"
    choice_list.name_option 3, "Merde"
    choice_list.name_option 4, "I'm gonna kick M. Bison's ass"
    choice_list.name_option 5, "*ANIMAL HOWL*"
    choice_list.go()
)

get_random_float_between = (min, max) ->
    return Math.random() * (max - min) + min

get_random_int_between = (min, max) ->
    return Math.round get_random_float_between min, max

class gui.ChoiceList
    constructor: (@num_options=6) ->
        @node = $('#choices')
        @width = @node.width()
        @height = @node.height()
        @choices = []
        @create_options()

    create_options: ->
        for i in [1..@num_options]
            node = $('<li class="choice"></li>')
            @node.append node
            @choices.push new gui.Choice node, @

    name_option: (num, text) ->
        @choices[num].change_text text

    place_options: ->
        for choice in @choices
            choice.place_randomly()

    move: ->
        @should_be_moving = true
        for choice in @choices
            choice.move()

    stop: (selected_option_num, callback) ->
        @should_be_moving = false

        # Clone the selected option and highlight it
        choice = @choices[selected_option_num]
        choice_offset = choice.node.offset()
        clone = choice.node.clone()
        $('body').append clone
        clone.css(
            left    : choice_offset.left
            top     : choice_offset.top
            margin  : 0
        )

        # Fade away everything else
        @node.animate(
            opacity : 0
        , 200, =>
            @node.css(
                visibility  : "hidden"
                opacity     : 1
            )

            # Give the selected option a little vertical boost
            clone.animate(
                top : "-=20px"
            , 200, =>
                clone.addClass "highlight"
                callback() if typeof callback is "function"
                setTimeout(=>
                    clone.remove()
                , 1000)
            )
        )

    go: ->
        for choice in @choices
            choice.node.css(
                left    : "-1000px"
                top     : "-1000px"
            )
        @place_options()
        @move()
        @node.css "visibility", "visible"

class gui.Choice
    constructor: (@node, @choice_list) ->
        @x = 0
        @y = 0
        @vel = 5
        @set_size_explicit()
        @set_random_direction()

    set_size_explicit: ->
        @node.css(
            width   : @node.width()
            height  : @node.height()
        )
        @width = @node.outerWidth true
        @height = @node.outerHeight true

    change_text: (text) ->
        @node.text text
        @node.css(
            width   : "auto"
            height  : "auto"
        )
        @set_size_explicit()

    move: ->
        clearInterval(@movement_interval) if @movement_interval
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
            if @choice_list.should_be_moving
                do_movement()
            else
                clearInterval @movement_interval
        , 50

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

class gui.HeartMeter
    constructor: (@total=100, @current=0) ->
        @node = $('#kylie_info')
        @bar_node_full = $('.fill', @node)
        @bar_node_temp = $('.diff', @node)
        @feedback_node = $('.feedback', @node)
        @set_bar_width @get_percentage()
        @set_bar_temp_width 0

    get_percentage: ->
        return Math.round @current/@total * 100

    set_bar_width: (amt) ->
        @bar_node_full.css "width", "#{amt}%"

    set_bar_temp_width: (amt) ->
        @bar_node_temp.css "width", "#{amt}px"

    increase: (amt) ->
        amt = Math.min amt, @total - @current
        percentage_jump = amt/@total * 100
        @current += amt
        old_width = @bar_node_full.width()
        @set_bar_width @get_percentage()
        width_diff = @bar_node_full.width() - old_width
        @set_bar_temp_width width_diff
        # Wait then animate health change
        setTimeout(=>
            @bar_node_temp.animate(
                width: "0"
            , 300, "linear")
        , 500)

    reduce: (amt) ->
        amt = Math.min amt, @current
        percentage_drop = amt/@total * 100
        old_percentage = @get_percentage()
        old_width = @bar_node_full.width()
        @current -= amt
        new_percentage = @get_percentage()
        @set_bar_width new_percentage
        width_diff = old_width - @bar_node_full.width()
        @set_bar_width old_percentage
        @set_bar_temp_width width_diff
        # Wait then animate the health change
        setTimeout(=>
            @bar_node_temp.animate(
                width: "0px"
            , 300, "linear")
            @bar_node_full.animate(
                width: "#{new_percentage}%"
            , 300, "linear")
        , 500)

    show_heart: (amt) ->
        heart = $('<div class="heart"></div>')
        text = $("<div class=\"score\">+#{amt}</div>")
        @feedback_node.append heart
        @feedback_node.append text
        setTimeout(=>
            heart.animate(
                opacity : 0
                top     : "-12px"
            , 300, ->
                $(this).remove()
            )
            text.animate(
                opacity : 0
            , 300, ->
                $(this).remove()
            )
        , 500)

    show_broken_heart: (amt) ->
        heart = $('<div class="heart_broken"></div>')
        text = $("<div class=\"score\">-#{amt}</div>")
        @feedback_node.append heart
        @feedback_node.append text
        setTimeout(=>
            heart.animate(
                opacity : 0
                top     : "48px"
            , 300, ->
                $(this).remove()
            )
            text.animate(
                opacity : 0
            , 300, ->
                $(this).remove()
            )
        , 500)

    update_score: (amt) ->
        if amt > 0
            @increase amt
            @show_heart amt
        else if amt < 0
            @reduce Math.abs amt
            @show_broken_heart amt
        else
            console.log "Do anything for 0 points?"

