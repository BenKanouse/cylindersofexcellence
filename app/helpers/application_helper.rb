module ApplicationHelper

  def alert_for(text, options = {})
    options[:class] =   'alert-info' unless options[:class]
    alert_class     =   "alert #{options[:class]}"
    button_options  =   { :class => 'close', :"data-dismiss" => 'alert'}
    button          =   ActiveSupport::SafeBuffer.new
    button          <<  content_tag(:button, "x", button_options)

    content_tag(:div, :class => alert_class) do
      button +
        content_tag(:span) do
        content_tag(:i, :class => 'icon-warning-sign', :style => 'margin-right: 1em;') do end + raw(text)
      end
    end
  end

  def flash_messages
    flash.each.map { |k, v|
      if k == :error || k == 'error'
        alert_for(v, :class => 'alert-danger')
      else
        alert_for(v, :class => 'alert-info')
      end
    }.inject(:+)
  end

end
