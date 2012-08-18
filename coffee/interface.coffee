window.gui = {}

class gui.HealthBar
    constructor: (@bar_node_full, @bar_node_temp, @empty_callback=null, @full_callback=null, @current=100) ->
        @total = 100
        @set_bar_width @get_percentage()
        @set_bar_temp_width 0

    get_percentage: ->
        return Math.round @current/@total * 100

    set_bar_width: (amt) ->
        @bar_node_full.css "width", "#{amt}%"

    set_bar_temp_width: (amt) ->
        @bar_node_temp.css "width", "#{amt}%"

    check_current_value: ->
        if @current <= 0
            @empty_callback() if typeof @empty_callback is "function"
        if @current >= 100
            @full_callback() if typeof @full_callback is "function"

    increase: (amt) ->
        amt = Math.min amt, @total - @current
        percentage_jump = amt/@total * 100
        @current += amt
        @set_bar_width @get_percentage - percentage_jump
        @set_bar_temp_width percentage_jump
        @check_current_value()
        # Wait then animate health change
        setTimeout(=>
            @bar_node_temp.animate(
                width: "0%"
            , 300)
            @bar_node_full.animate(
                width: "+=#{percentage_jump}%"
            , 300)
        , 500)

    reduce: (amt) ->
        amt = Math.min amt, @current
        percentage_drop = amt/@total * 100
        @current -= amt
        @set_bar_width @get_percentage()
        @set_bar_temp_width percentage_drop
        @check_current_value()
        # Wait then animate the health change
        setTimeout(=>
            @bar_node_temp.animate(
                width: "0%"
            , 300)
        , 500)

$(->
    window.health = new gui.HealthBar $('.health_bar .fill'), $('.health_bar .empty'), ->
        console.log "GAME OVER"
    , ->
        console.log "MAXIMUM POWER"
    , 75
)
