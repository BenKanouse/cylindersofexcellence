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

  def page_header(title, &block)
    content_tag(:div, :class => 'page-header') do
      content_tag(:h2) do
        content = block_given? ? content_tag(:small) { yield } : ActiveSupport::SafeBuffer.new
        ActiveSupport::SafeBuffer.new("#{title}".to_s.titlecase) + content
      end
    end
  end

  def panel(title, options = {}, &block)
    panel_class = unless options[:class]
                    'panel-default'
                  else
                    options[:class]
                  end

    content_tag(:div, :class => "panel #{panel_class}") do
      content_tag(:div, :class => 'panel-heading') do
        title
      end +
      content_tag(:div, :class => 'panel-body') do
        yield
      end
    end
  end

  def safari_dialog
    content_tag(:div, id: 'dialog', title: 'Please Enable WebGL') do
      content_tag(:p) do
        'You are missing out on the Awesome... Please enable WebGL for Safari browser'
      end  + dialog_link
    end
  end

  def show_repo_button(repo)
    button_params = { repo: { name: repo.owner_and_name } }
    options = { action: "create", controller: "repos", params: button_params }
    html_options = { class: 'btn btn-link btn-lg repo-show' }
    button_to(repo.owner_and_name, options, html_options)
  end

  def table_bones(options = {}, &block)
    content_tag(:table, :class => 'table table-bordered table-striped table-hover') do
      content_tag(:tbody) do
        yield
      end
    end
  end

  private

  def dialog_link
    link_to 'Details', 'http://onvert.com/guides/enable-webgl-safari/', class: 'btn btn-link', target: '_blank'
  end

end
