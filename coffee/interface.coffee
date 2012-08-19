window.gui = {}

$(->
    window.heart_meter = new gui.HeartMeter()
)

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

